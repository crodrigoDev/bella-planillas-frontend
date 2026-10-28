import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { zodResolverOptions } from "@/lib/zodMessages.utils";
import {
  DatosDerechohabienteSchema,
  type DerechohabienteDraft,
} from "../schemas/datosDerechohabiente.schema";
import { useNuevoEmpleadoStore } from "../store/nuevoEmpleado.store";

const resolver = zodResolver(DatosDerechohabienteSchema, zodResolverOptions);

type DerechohabienteFormValues = Parameters<typeof resolver>[0];

// Valores con los que empieza cada derechohabiente que se agrega
const EMPTY_VALUES = {
  nro_documento: "",
  nombres: "",
  apellidos: "",
  estado_civil: "SOLTERO",
  fecha_nacimiento: "",
} as const;

/**
 * Maneja el formulario y la lista de derechohabientes del paso 4 del registro
 *
 * @remarks
 * Agregar, editar y quitar solo cambian el borrador en memoria: se envían
 * al backend en el último paso. El mismo formulario sirve para agregar y para
 * editar: al editar se llena con los datos del familiar elegido.
 *
 * @returns Los métodos del formulario, la lista y las acciones para la pantalla
 */
export function useDerechohabientesForm() {
  const derechohabientes = useNuevoEmpleadoStore(
    (state) => state.derechohabientes,
  );
  const addDerechohabiente = useNuevoEmpleadoStore(
    (state) => state.addDerechohabiente,
  );
  const updateDerechohabiente = useNuevoEmpleadoStore(
    (state) => state.updateDerechohabiente,
  );
  const removeDerechohabiente = useNuevoEmpleadoStore(
    (state) => state.removeDerechohabiente,
  );

  // Posición del familiar que se está editando; null si se agrega uno nuevo
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  // Cambia cada vez que se rellena o se limpia el formulario. `reset` de
  // react-hook-form suelta el registro de los campos y, con el compilador de
  // React, no se vuelven a enlazar solos: la `key` los monta de nuevo.
  const [formKey, setFormKey] = useState(0);
  // Punto al que se desplaza la pantalla al editar un familiar
  const formAnchorRef = useRef<HTMLDivElement>(null);

  const methods = useForm<
    DerechohabienteFormValues,
    unknown,
    DerechohabienteDraft
  >({
    resolver,
    defaultValues: EMPTY_VALUES,
  });

  const isEditing = editingIndex !== null;

  const resetForm = (values: Partial<DerechohabienteFormValues>) => {
    methods.reset(values);
    setFormKey((key) => key + 1);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    resetForm(derechohabientes[index]);
    formAnchorRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    resetForm(EMPTY_VALUES);
  };

  const handleRemove = (index: number) => {
    removeDerechohabiente(index);

    // Si se quita el que se edita, se descarta; si era uno anterior, la posición se corre
    if (editingIndex === index) handleCancelEdit();
    else if (editingIndex !== null && index < editingIndex)
      setEditingIndex(editingIndex - 1);
  };

  const handleSubmit = methods.handleSubmit((values) => {
    // El backend rechaza dos familiares con el mismo documento
    const isDuplicated = derechohabientes.some(
      (item, index) =>
        index !== editingIndex && item.nro_documento === values.nro_documento,
    );

    if (isDuplicated) {
      methods.setError("nro_documento", {
        message: "Ya agregaste un familiar con este documento",
      });
      return;
    }

    if (isEditing) updateDerechohabiente(editingIndex, values);
    else addDerechohabiente(values);

    setEditingIndex(null);
    resetForm(EMPTY_VALUES);
  });

  return {
    methods,
    derechohabientes,
    isEditing,
    formKey,
    formAnchorRef,
    handleEdit,
    handleCancelEdit,
    handleRemove,
    handleSubmit,
  };
}

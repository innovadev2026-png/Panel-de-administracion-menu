// /components/ui/Alert/index.ts
import Swal from "sweetalert2";

export const Alert = {
  success: (title, text) =>
    Swal.fire({
      icon: "success",
      title,
      text,
      confirmButtonColor: "var(--accent)",
    }),

  error: (title, text) =>
    Swal.fire({
      icon: "error",
      title,
      text,
      confirmButtonColor: "var(--accent)",
    }),

  warning: (title, text) =>
    Swal.fire({
      icon: "warning",
      title,
      text,
      confirmButtonColor: "var(--accent)",
    }),

  confirm: async ({
    title = "¿Estás seguro?",
    text = "",
    confirmText = "Sí",
    cancelText = "Cancelar",
  }) => {
    const result = await Swal.fire({
      icon: "question",
      title,
      text,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      confirmButtonColor: "var(--accent)",
    });

    return result.isConfirmed;
  },
};

//uso del alert:

// import { Alert } from "@/components/ui/Alert";

// // éxito
// Alert.success("Guardado", "El restaurante fue creado");

// // error
// Alert.error("Error", "Algo falló");

// // confirmación
// const ok = await Alert.confirm({
//   title: "Eliminar",
//   text: "Esta acción no se puede revertir",
// });

// if (ok) {
//   // ejecutar acción
// }
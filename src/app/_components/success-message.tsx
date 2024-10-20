import { useSuccessMessage } from "~/context/SuccessMessageContext";

export default function SuccessMessage() {
  const { successMessage } = useSuccessMessage();

  return (
    successMessage && (
    <div className="bg-green-200 text-green-800 px-4 py-2 rounded-md mb-4">
      {successMessage}
    </div>
  ));
}
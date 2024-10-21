import { useMessage } from "~/context/message";

export default function MessageBanner() {
  const { successMessage, errorMessage } = useMessage();

  return (
    <div>
      {successMessage && (
      <div className="bg-green-200 text-green-800 px-4 py-2 rounded-md mb-4">
        {successMessage}
      </div>
      )}
      {errorMessage && (
         <div className="bg-red-200 text-red-800 px-4 py-2 rounded-md mb-4">
         {errorMessage}
       </div>
       )}
  </div>
  );
}
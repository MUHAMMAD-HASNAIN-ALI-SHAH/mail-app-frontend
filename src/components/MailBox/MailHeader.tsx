import { RefreshCcw, Trash2 } from "lucide-react";
import useMailStore from "../../store/useMailStore";

const MailHeader = () => {
  const { isMailOpen, checkboxs, trash } = useMailStore();
  return (
    <div className="flex items-center justify-between p-4 bg-white">
      {!isMailOpen && (
        <>
          <h1 className="text-xl font-semibold">Your mails</h1>
          <div className="flex items-center space-x-4">
            <button className="text-blue-600 hover:text-blue-800 transition flex items-center space-x-2">
              {checkboxs.length > 0 && <Trash2 size={20} className="cursor-pointer" onClick={() => trash()} />}
              <RefreshCcw size={20} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MailHeader;

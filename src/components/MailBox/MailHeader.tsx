import { Recycle, RefreshCcw, Trash2 } from "lucide-react";
import useMailStore from "../../store/useMailStore";
import useSidebarStore from "../../store/useSidebarStore";

const MailHeader = () => {
  const { isMailOpen, checkboxs, trash, unTrash } = useMailStore();
  const { sidebarMenu } = useSidebarStore();
  return (
    <div className="flex items-center justify-between p-4 bg-white">
      {!isMailOpen && (
        <>
          <h1 className="text-xl font-semibold">Your mails</h1>
          <div className="flex items-center space-x-4">
            <button className="text-blue-600 hover:text-blue-800 transition flex items-center space-x-2">
              {(sidebarMenu === "inbox" || sidebarMenu === "sent") && (
                <>
                  {checkboxs.length > 0 && (
                    <Trash2
                      size={20}
                      className="cursor-pointer"
                      onClick={() => trash()}
                    />
                  )}
                  <RefreshCcw size={20} className="cursor-pointer" />
                </>
              )}
             {
                sidebarMenu === "trash" && (
                  <>
                    {checkboxs.length > 0 && (
                      <Recycle
                        size={20}
                        className="cursor-pointer"
                        onClick={() => unTrash()}
                      />
                    )}
                  </>
                )}              
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MailHeader;

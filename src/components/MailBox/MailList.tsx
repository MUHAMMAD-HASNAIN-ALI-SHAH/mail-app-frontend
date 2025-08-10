import { useEffect } from "react";
import useMailStore from "../../store/useMailStore";
import useSidebarStore from "../../store/useSidebarStore";
import useAuthStore from "../../store/useAuthStore";
import { StarIcon } from "lucide-react";

const MailsList = ({ mails }: { mails: any[] }) => {
  const {
    setOpenedMail,
    starMailToggle,
    setCheckboxs,
    checkboxs,
    clearCheckboxs,
  } = useMailStore();
  const userId = useAuthStore.getState().user?.id;
  const { sidebarMenu } = useSidebarStore();

  useEffect(() => {
    clearCheckboxs();
  }, [mails.length]);

  return (
    <div className="flex flex-col gap-2 p-4">
      {mails.length > 0 ? (
        mails.map((mail) => {
          const isRecipient = userId === mail.recipient._id;
          const isUnread = isRecipient
            ? !mail.isReadByRecipient
            : !mail.isReadBySender;

          return (
            <div
              key={mail._id}
              onClick={() => {
                sidebarMenu !== "trash" && setOpenedMail(mail);
              }}
              className="flex items-center justify-between p-2 hover:bg-gray-100 transition-all border border-blue-100 rounded-xl cursor-pointer"
            >
              <div className="flex flex-col w-full">
                <div className="flex justify-between items-center w-full mb-1">
                  <div className="flex w-full items-center gap-2 overflow-hidden">
                    {/* Left: checkbox + star + sender */}
                    <div className="flex items-center gap-2 shrink-0 w-[160px]">
                      {sidebarMenu !== "starred" && (
                        <input
                          onChange={() => setCheckboxs(mail._id)}
                          checked={checkboxs.includes(mail._id)}
                          type="checkbox"
                          className="h-4 w-4"
                          onClick={(e) => e.stopPropagation()}
                        />
                      )}
                      {(isRecipient
                        ? !mail.isTrashedByRecipient
                        : !mail.isTrashedBySender) && (
                        <StarIcon
                          className={`cursor-pointer ${
                            isRecipient
                              ? mail.isStarredByRecipient
                                ? "fill-yellow-500 stroke-yellow-400"
                                : "stroke-gray-400"
                              : mail.isStarredBySender
                              ? "fill-yellow-500 stroke-yellow-400"
                              : "stroke-gray-400"
                          }`}
                          size={20}
                          onClick={(e) => {
                            e.stopPropagation();
                            starMailToggle(mail._id);
                          }}
                        />
                      )}

                      <p
                        className={`truncate whitespace-nowrap overflow-hidden text-sm ${
                          isUnread ? "font-bold text-gray-900" : "text-gray-800"
                        }`}
                      >
                        {typeof mail.sender === "string"
                          ? mail.sender
                          : mail.sender.username}
                      </p>
                    </div>

                    {/* Subject + Body Preview */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`truncate whitespace-nowrap overflow-hidden text-sm ${
                          isUnread
                            ? "font-semibold text-black"
                            : "text-gray-700"
                        }`}
                      >
                        {mail.subject} : {mail.body.replace(/<[^>]+>/g, "")}
                      </p>
                    </div>
                  </div>

                  {/* Time */}
                  <p className="text-xs text-gray-500 whitespace-nowrap ml-2 shrink-0">
                    {new Date(mail.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="flex items-center justify-center h-64">
          <p>No mails found</p>
        </div>
      )}
    </div>
  );
};

export default MailsList;

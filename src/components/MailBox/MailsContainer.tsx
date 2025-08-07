import { ArrowBigLeft, Delete, StarIcon, User } from "lucide-react";
import useAuthStore from "../../store/useAuthStore";
import useMailStore from "../../store/useMailStore";
import useSidebarStore from "../../store/useSidebarStore";
import { useEffect } from "react";

// 📬 Mail Detail Component
const MailDetail = ({ mail }: { mail: any }) => {
  const { closeMail, markRead, trashMail } = useMailStore();

  useEffect(() => {
    if (mail && !mail.isReadByRecipient) {
      markRead(mail._id);
    }
  }, [mail, markRead]);

  return (
    <div className="p-4 bg-white">
      <div className="flex items-center mb-4">
        <ArrowBigLeft className="cursor-pointer" onClick={closeMail} />
        <Delete
          onClick={() => trashMail(mail._id)}
          className="ml-2 cursor-pointer"
        />
      </div>
      <h2 className="text-4xl font-semibold my-5">{mail.subject}</h2>
      <div className="flex items-center gap-2 text-gray-600 mb-4 text-sm">
        <User className="w-10 h-10 text-gray-500 bg-gray-300 rounded-full p-2" />
        <span className="font-semibold">From:</span>
        <span>
          {typeof mail.sender === "string" ? mail.sender : mail.sender.username}
        </span>
      </div>
      <div
        className="text-gray-800"
        dangerouslySetInnerHTML={{ __html: mail.body }}
      ></div>

      {mail.attachments?.length > 0 && (
        <a
          href={mail.attachments[0].url}
          download
          className="text-blue-500 hover:underline mt-4 block"
        >
          Download Attachment
        </a>
      )}
    </div>
  );
};

// 📬 Mail List Item
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

// 📨 Mails Container (Parent)
const MailsContainer = () => {
  let { mails, isMailOpen, openedMail } = useMailStore();
  const { sidebarMenu } = useSidebarStore();
  const { user } = useAuthStore();

  if (user) {
    if (sidebarMenu === "inbox") {
      mails = mails.filter(
        (mail) =>
          mail.recipient._id === user.id &&
          !mail.isTrashedByRecipient &&
          !mail.isDeletedByRecipient
      );
    } else if (sidebarMenu === "sent") {
      mails = mails.filter(
        (mail) =>
          mail.sender._id === user.id &&
          !mail.isTrashedBySender &&
          !mail.isDeletedBySender
      );
    } else if (sidebarMenu === "starred") {
      mails = mails.filter((mail) => {
        const isRecipient = mail.recipient._id === user.id;
        const isNotTrashed = isRecipient
          ? !mail.isTrashedByRecipient
          : !mail.isTrashedBySender;
        const isNotDeleted = isRecipient
          ? !mail.isDeletedByRecipient
          : !mail.isDeletedBySender;
        const check = isRecipient && isNotDeleted && isNotTrashed;
        return check ? mail.isStarredByRecipient : mail.isStarredBySender;
      });
    } else if (sidebarMenu === "trash") {
      mails = mails.filter((mail) => {
        const isRecipient = mail.recipient._id === user.id;
        return isRecipient ? mail.isTrashedByRecipient : mail.isTrashedBySender;
      });
    }
  }

  return (
    <>
      {!isMailOpen && <MailsList mails={mails} />}
      {isMailOpen && <MailDetail mail={openedMail} />}
    </>
  );
};

export default MailsContainer;

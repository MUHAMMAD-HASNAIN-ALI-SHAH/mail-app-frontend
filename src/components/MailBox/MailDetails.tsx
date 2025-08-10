import { ArrowBigLeft, Delete } from "lucide-react";
import { useEffect } from "react";
import useMailStore from "../../store/useMailStore";
import { User } from "lucide-react";

const MailDetailsCard = ({
  mail,
}: {
  mail: {
    subject: string;
    sender: { username: string } | string;
    body: string;
    attachment?: string;
  };
}) => {
  return (
    <>
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

      {mail.attachment && (
        <img
          src={mail.attachment}
          className="text-blue-500 hover:underline mt-4 block max-w-70"
        />
      )}
    </>
  );
};

const MailDetails = ({ mail }: { mail: any }) => {
  const { closeMail, markRead, trash } = useMailStore();

  useEffect(() => {
    if (mail && !mail.isReadByRecipient) {
      markRead(mail._id);
    }
  }, [mail, markRead]);

  return (
    <>
      <div className="p-4 bg-white">
        {/* Header actions */}
        <div className="flex items-center mb-4">
          <ArrowBigLeft className="cursor-pointer" onClick={closeMail} />
          <Delete
            onClick={() => {
              trash(mail._id);
              closeMail();
            }}
            className="ml-2 cursor-pointer"
          />
        </div>

        {/* Main mail */}
        <MailDetailsCard mail={mail} />
      </div>
    </>
  );
};

export default MailDetails;

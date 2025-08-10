import useAuthStore from "../../store/useAuthStore";
import useMailStore from "../../store/useMailStore";
import useSidebarStore from "../../store/useSidebarStore";
import MailDetails from "./MailDetails";
import MailsList from "./MailList";

const MailsContainer = () => {
  let { mails, isMailOpen, openedMail } = useMailStore();
  const { sidebarMenu } = useSidebarStore();
  const { user } = useAuthStore();

  const filteredMails = mails.filter((mail) => {
    const isRecipient = mail.recipient._id === user?.id;
    const isSender = mail.sender._id === user?.id;

    switch (sidebarMenu) {
      case "inbox":
        return (
          isRecipient &&
          !mail.isTrashedByRecipient &&
          !mail.isDeletedByRecipient
        );

      case "sent":
        return isSender && !mail.isTrashedBySender && !mail.isDeletedBySender;

      case "starred":
        if (isRecipient) {
          return (
            !mail.isTrashedByRecipient &&
            !mail.isDeletedByRecipient &&
            mail.isStarredByRecipient
          );
        } else if (isSender) {
          return (
            !mail.isTrashedBySender &&
            !mail.isDeletedBySender &&
            mail.isStarredBySender
          );
        }
        return false;

      case "trash":
        return isRecipient ? mail.isTrashedByRecipient : mail.isTrashedBySender;

      default:
        return false;
    }
  });

  return (
    <>
      {!isMailOpen && <MailsList mails={filteredMails} />}
      {isMailOpen && <MailDetails mail={openedMail} />}
    </>
  );
};

export default MailsContainer;

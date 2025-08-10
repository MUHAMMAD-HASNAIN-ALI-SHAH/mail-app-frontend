import { useEffect } from "react";
import MailHeader from "./MailHeader";
import useMailStore from "../store/useMailStore";
import { Loader } from "lucide-react";
import MailsContainer from "./MailBox/MailsContainer";

const Mailbox = () => {
  const { subscribeToMails, getMyRecentMails, loading } = useMailStore();
  useEffect(() => {
    subscribeToMails();
    getMyRecentMails();
  }, [subscribeToMails, getMyRecentMails]);
  return (
    <div className="w-full overflow-hidden">
      <MailHeader />
      <div className="flex flex-col ">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p>
              <Loader className="animate-spin mr-2" />
            </p>
          </div>
        ) : (
          <div className="overflow-y-hidden">
            <MailsContainer />
          </div>
        )}
      </div>
    </div>
  );
};

export default Mailbox;

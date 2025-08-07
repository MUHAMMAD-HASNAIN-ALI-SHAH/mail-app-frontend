import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import useSidebarStore from "../store/useSidebarStore";
import Mailbox from "../components/Mailbox";
import { PlusIcon } from "lucide-react";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import CreateMail from "../components/CreateMail";

const Home = () => {
  const { isOpen } = useSidebarStore();
  const [opened, { open, close }] = useDisclosure(false);

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const willMakeBlur = screenWidth < 768 && isOpen;
  const willShowButton = screenWidth < 768 && !isOpen;

  return (
    <div className="h-screen w-full flex flex-col bg-gray-100 overflow-hidden">
      <Modal
        opened={opened}
        onClose={close}
        title="Create a new mail"
        fullScreen
        radius={0}
        transitionProps={{ transition: "fade", duration: 200 }}
      >
        <CreateMail onClose={close} />
      </Modal>
      <Navbar />
      {willShowButton && (
        <div
          onClick={open}
          className="fixed bottom-4 right-4 z-50 rounded-full bg-blue-500 hover:bg-blue-700 transition"
        >
          <PlusIcon className="h-6 w-6 text-white m-3" />
        </div>
      )}

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        <div
          onClick={() =>
            willMakeBlur && useSidebarStore.setState({ isOpen: false })
          }
          className={`flex-1 overflow-y-auto p-6 ${
            willMakeBlur ? "blur-sm bg-black/50" : "bg-gray-50"
          }`}
        >
          <div style={{ pointerEvents: willMakeBlur ? "none" : "auto" }}>
            <h1 className="text-2xl font-semibold">Welcome to MailHub</h1>
            <Mailbox />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

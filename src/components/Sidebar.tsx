import { Inbox, Send, Star, PencilLine, LucideDelete } from "lucide-react";
import useSidebarStore from "../store/useSidebarStore";
import clsx from "clsx";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import CreateMail from "./CreateMail";

const Sidebar = () => {
  const { isOpen, setSidebarMenu } = useSidebarStore();
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <div
      className={clsx(
        "absolute z-50 md:relative h-screen bg-white border-r border-blue-100 shadow-md transition-all duration-300 overflow-hidden",
        isOpen ? "w-80 sm:w-52 md:w-60 p-4 opacity-100" : "w-0 p-0 opacity-0"
      )}
    >
      <Modal
        opened={opened}
        onClose={close}
        title="Create a new mail."
        fullScreen
        radius={0}
        transitionProps={{ transition: "fade", duration: 200 }}
      >
        <CreateMail onClose={close} />
      </Modal>
      <div
        className={clsx(
          "space-y-2 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Compose */}
        <button
          onClick={open}
          className="w-full hidden md:flex items-center gap-3 bg-blue-200 text-xl py-6 px-4 rounded-lg cursor-pointer transition"
        >
          <PencilLine size={20} />
          <span>Compose</span>
        </button>

        {/* Menu Items */}
        <div className="mt-4 space-y-2 text-gray-700">
          <SidebarItem
            icon={<Inbox size={20} />}
            label="Inbox"
            onClick={() => setSidebarMenu("inbox")}
          />
          <SidebarItem
            icon={<Send size={20} />}
            label="Sent"
            onClick={() => setSidebarMenu("sent")}
          />
          <SidebarItem
            icon={<Star size={20} />}
            label="Starred"
            onClick={() => setSidebarMenu("starred")}
          />
          <SidebarItem
            icon={<LucideDelete size={20} />}
            label="Trash"
            onClick={() => setSidebarMenu("trash")}
          />
        </div>
      </div>
    </div>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const SidebarItem = ({ icon, label, onClick }: SidebarItemProps) => {
  const { sidebarMenu } = useSidebarStore();
  return (
    <div
      className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition ${
        sidebarMenu === label.toLowerCase()
          ? "bg-gray-300"
          : "hover:bg-gray-100"
      }`}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
};

export default Sidebar;

import { toast } from "react-toastify";
import { create } from "zustand";
import axiosInstance from "../lib/axios";
import useAuthStore from "./useAuthStore";
import debounce from "lodash.debounce";
import type { DebouncedFunc } from "lodash";

// Debounced calls per mailId
const debouncedStarMap = new Map<string, DebouncedFunc<() => void>>();

const triggerStarAPI = (mailId: string) => {
  if (!debouncedStarMap.has(mailId)) {
    const debouncedFn = debounce(async () => {
      try {
        await axiosInstance.post(`/api/v2/mail/star/${mailId}`);
      } catch (error) {
        toast.error("Failed to star mail");
      }
    }, 1000);

    debouncedStarMap.set(mailId, debouncedFn);
  }

  const fn = debouncedStarMap.get(mailId);
  fn?.(); // call it
};

// Optional: Flush all pending calls on unload
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    for (const fn of debouncedStarMap.values()) {
      fn.flush?.();
    }
  });
}

export interface Mail {
  _id: string;
  sender: {
    _id: string;
    username: string;
  };
  recipient: {
    _id: string;
    username: string;
  };
  subject: string;
  body: string;
  attachments: {
    url: string;
    fileName: string;
    fileType: string;
  }[];
  isReadBySender: boolean;
  isReadByRecipient: boolean;
  isStarredBySender: boolean;
  isStarredByRecipient: boolean;
  isTrashedBySender: boolean;
  isTrashedByRecipient: boolean;
  isDeletedBySender: boolean;
  isDeletedByRecipient: boolean;
  threadId?: string;
  replyTo?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

interface MailState {
  mails: Mail[];
  addMail: (mail: Mail) => void;
  loading: boolean;
  isMailOpen: boolean;
  openedMail: Mail | null;
  mailBoxOpen: boolean;
  isMailSending: Boolean;
  toggleMailBox: () => void;
  checkboxs: string[];
  setCheckboxs: (id: string) => void;
  clearCheckboxs: () => void;
  sendMail: (formData: {
    username: string;
    subject: string;
    body: string;
    file: File | null;
  }) => Promise<void>;
  setOpenedMail: (mail: Mail) => void;
  closeMail: () => void;
  setMailOpen: (isOpen: boolean) => void;
  subscribeToMails: () => void;
  getMyRecentMails: () => void;
  markRead: (mailId: string) => void;
  starMailToggle: (mailId: string) => void;
  trashMail: (mailId: string) => void;
  trashMultipleMails: () => void;
}

const useMailStore = create<MailState>((set) => ({
  mails: [],
  isMailOpen: false,
  loading: false,
  openedMail: null,
  mailBoxOpen: false,
  isMailSending: false,
  checkboxs: [],
  setCheckboxs: (id: string) =>
    set((state) => {
      if (state.checkboxs.includes(id)) {
        return { checkboxs: state.checkboxs.filter((item) => item !== id) };
      } else {
        return { checkboxs: [...state.checkboxs, id] };
      }
    }),
  clearCheckboxs: () => set({ checkboxs: [] }),
  toggleMailBox: () => set((state) => ({ mailBoxOpen: !state.mailBoxOpen })),
  sendMail: async (formData) => {
    set({ isMailSending: true });

    try {
      const data = new FormData();
      data.append("username", formData.username);
      data.append("subject", formData.subject);
      data.append("body", formData.body);

      if (formData.file) {
        data.append("file", formData.file); // append file
      }

      const result = await axiosInstance.post("/api/v2/mail", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      set((state) => ({
        mails: [result.data.mail, ...state.mails],
      }));
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to send mail");
    } finally {
      set({ isMailSending: false });
    }
  },
  addMail: (mail) => set((state) => ({ mails: [mail, ...state.mails] })),
  closeMail: () => set({ isMailOpen: false, openedMail: null }),
  setOpenedMail: (mail) => set({ openedMail: mail, isMailOpen: true }),
  setMailOpen: (isOpen) => set({ isMailOpen: isOpen }),
  getMyRecentMails: async () => {
    try {
      const response = await axiosInstance.get("/api/v2/mail/recent-mails");
      set({ mails: response.data });
    } catch (error) {
      toast.error("Failed to fetch recent mails");
    }
  },
  subscribeToMails: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) {
      console.error("Socket not connected");
      return;
    }

    socket.off("new-mail");

    socket.on("new-mail", (data: { mail: Mail }) => {
      console.log("New mail received:", data.mail);
      set((state) => ({
        mails: [data.mail, ...state.mails],
      }));
    });
  },
  markRead: async (mailId: string) => {
    try {
      await axiosInstance.post(`/api/v2/mail/mark-read/${mailId}`);
      set((state) => ({
        mails: state.mails.map((mail) =>
          mail._id === mailId ? { ...mail, isReadByRecipient: true } : mail
        ),
      }));
    } catch (error) {
      toast.error("Failed to mark mail as read");
    }
  },
  starMailToggle: async (mailId: string) => {
    try {
      const userId = useAuthStore.getState().user?.id;
      set((state) => ({
        mails: state.mails.map((mail) =>
          mail._id === mailId
            ? userId === mail.sender._id
              ? { ...mail, isStarredBySender: !mail.isStarredBySender }
              : { ...mail, isStarredByRecipient: !mail.isStarredByRecipient }
            : mail
        ),
      }));

      triggerStarAPI(mailId);
    } catch (error) {
      toast.error("Failed to star mail");
    }
  },
  trashMail: async (mailId: string) => {
    try {
      const userId = useAuthStore.getState().user?.id;

      set((state) => ({
        mails: state.mails.map((mail) => {
          if (mail._id !== mailId) return mail;

          const isRecipient = userId === mail.recipient._id;

          return {
            ...mail,
            ...(isRecipient
              ? { isTrashedByRecipient: true }
              : { isTrashedBySender: true }),
          };
        }),
        openedMail: null,
        isMailOpen: false,
      }));
      await axiosInstance.delete(`/api/v2/mail/trash/${mailId}`);
    } catch (error) {
      toast.error("Failed to delete mail");
    }
  },
  trashMultipleMails: () =>
    set((state) => {
      const { checkboxs, mails } = state;
      const userId = useAuthStore.getState().user?.id;

      const updatedMails = mails.map((mail) => {
        if (checkboxs.includes(mail._id)) {
          return {
            ...mail,
            ...(userId === mail.recipient._id
              ? { isTrashedByRecipient: true }
              : { isTrashedBySender: true }),
          };
        }
        return mail;
      });

      axiosInstance.delete("/api/v2/mail/trash-multiple", { data: { mailIds: checkboxs } });

      return { mails: updatedMails, checkboxs: [] };
    }),
}));

export default useMailStore;

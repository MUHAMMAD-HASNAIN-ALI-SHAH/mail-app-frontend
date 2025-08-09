import { useState } from "react";
import useMailStore from "../store/useMailStore";
import RichTextEditor from "./MailBox/RichTextEditor";

interface CreateMailProps {
  onClose: () => void;
}

const CreateMail = ({ onClose }: CreateMailProps) => {
  const { isMailSending, sendMail } = useMailStore();

  const [form, setForm] = useState<{
    username: string;
    subject: string;
    body: string;
    file: string;
  }>({
    username: "",
    subject: "",
    body: "",
    file: "",
  });

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setForm((prev) => ({ ...prev, file: "" }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setForm((prev) => ({ ...prev, file: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const onChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", form);
    sendMail(form)
      .then(() => {
        setForm({
          username: "",
          subject: "",
          body: "",
          file: "",
        });
        onClose();
      })
      .catch((error) => {
        console.error("Error sending mail:", error);
      });
  };

  return (
    <>
      <div className="w-full h-full bg-white flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-0">
          <h2 className="text-lg font-semibold">Create the mail.</h2>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-grow gap-4 py-4 overflow-y-auto"
        >
          {/* To */}
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={onChange}
            className="border-none rounded px-3 py-2 w-full focus:outline-none text-sm"
            placeholder="Recipient username"
          />

          {/* Subject */}
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={onChange}
            className="border-none rounded px-3 py-2 w-full focus:outline-none text-sm"
            placeholder="Subject"
          />

          {/* Body */}
          <div className="flex-grow min-h-[200px]">
            <RichTextEditor
              onContentChange={(content) => setForm({ ...form, body: content })}
            />
          </div>

          {/* File Upload */}
          <input
            type="file"
            onChange={onChangeFile}
            className="w-full text-sm border border-gray-300 rounded px-2 py-1"
            accept="image/*"
          />

          {/* display image */}
          {form.file && (
            <img
              src={form.file}
              alt="Uploaded"
              className="mt-2 max-h-60 max-w-60"
            />
          )}

          {/* Send Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!!isMailSending}
              className="bg-blue-600 text-white font-bold rounded-md px-5 py-2 hover:bg-blue-700 transition"
            >
              {isMailSending ? "Sending..." : "Send"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateMail;

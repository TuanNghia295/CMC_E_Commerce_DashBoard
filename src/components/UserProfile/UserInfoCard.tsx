/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import { useDebounce } from "../../hooks/useDebounce";
import { useUpdateUser } from "../../hooks/useUpdateUser";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import type { User } from "../../types/user";

type UserInfoCardProps = {
  user: User;
};

export default function UserInfoCard({ user }: UserInfoCardProps) {
  console.log("user",user);
  
  const { isOpen, closeModal } = useModal();
  const updateUserMutation = useUpdateUser();

  // Form state
  const [fullName, setFullName] = useState(user.full_name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || "");

  // Saving state
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Reset form when opening modal or user changes
  useEffect(() => {
    if (!isOpen) return;
    setFullName(user.full_name ?? "");
    setEmail(user.email ?? "");
    setPhone(user.phone ?? "");
    setHasChanges(false);
  }, [isOpen]);


  // Debounce inputs
  const dFullName = useDebounce(fullName, 800);
  const dEmail = useDebounce(email, 800);
  const dPhone = useDebounce(phone, 800);

  // Detect changes
    useEffect(() => {
    if (!isOpen) return;

    // chưa load user → bỏ qua
    if (!fullName || !email) return;

    const changed =
      dFullName !== user.full_name ||
      dEmail !== user.email ||
      dPhone !== (user.phone || "");

    setHasChanges(changed);

    if (changed) {
      autoSave(dFullName, dEmail, dPhone);
    }
  }, [dFullName, dEmail, dPhone, isOpen]);

  async function autoSave(
  full_name?: string,
  email?: string,
  phone?: string
) {
  const safeFullName = (full_name ?? "").trim();
  const safeEmail = (email ?? "").trim();
  const safePhone = (phone ?? "").trim();

  const data: any = {};

  if (safeFullName !== user.full_name) {
    data.full_name = safeFullName;
  }

  if (safeEmail !== user.email) {
    data.email = safeEmail;
  }

  if (safePhone !== (user.phone || "")) {
    data.phone = safePhone || null;
  }

  if (Object.keys(data).length === 0) return;

  try {
    setIsSaving(true);
    await updateUserMutation.mutateAsync({
      id: user.id,
      data,
    });
    setHasChanges(false);
  } finally {
    setIsSaving(false);
  }
  }


  function handleClose() {
    closeModal();
  }

  async function handleSave() {
    await autoSave(fullName, email, phone);
    closeModal();
  }

  // Safe input handlers - xử lý cả event object và value trực tiếp
  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  return (
    <div className="p-5 border rounded-2xl dark:border-gray-800 lg:p-6">
      {/* Display info */}
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-lg font-semibold">Personal Information</h4>

          <div className="grid grid-cols-2 gap-6 mt-4">
            <InfoRow label="Full Name" value={user.full_name || "Admin"} />
            <InfoRow label="Email" value={user.email} />
            <InfoRow label="Phone" value={user.phone || "+84 123 456 789"} />
          </div>
        </div>

        {/* <button
          onClick={openModal}
          className="rounded-full border px-4 py-2 text-sm"
        >
          Edit
        </button> */}
      </div>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={handleClose}>
        <div className="p-6 bg-white dark:bg-gray-900 rounded-xl">
          <h4 className="text-xl font-semibold mb-2">
            Edit Personal Information
          </h4>

          <p className="text-sm text-gray-500 mb-6">
            {isSaving && "• Auto-saving..."}
            {hasChanges && !isSaving && "• Unsaved changes"}
          </p>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <Label>Full Name</Label>
              <Input
                value={fullName}
                onChange={handleFullNameChange}
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                value={email}
                onChange={handleEmailChange}
              />
            </div>

            <div>
              <Label>Phone</Label>
              <Input
                value={phone}
                onChange={handlePhoneChange}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" size="sm" onClick={()=>handleClose()}>
              Close
            </Button>
            <Button size="sm" onClick={()=>handleSave()} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* Small helper component */
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
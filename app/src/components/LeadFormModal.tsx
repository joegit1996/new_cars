"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle } from "lucide-react";
import PlaceholderImage from "./PlaceholderImage";

interface VehicleContext {
  brandName: string;
  modelName: string;
  trimName: string;
  variantName?: string;
}

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: VehicleContext;
}

type ContactMethod = "Call" | "WhatsApp" | "Email";
type PreferredTime = "Morning" | "Afternoon" | "Evening" | "Anytime";

function ChipSelect<T extends string>({
  options,
  selected,
  onChange,
  label,
}: {
  options: T[];
  selected: T | null;
  onChange: (val: T) => void;
  label: string;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-[#1E293B] mb-2">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
              selected === option
                ? "bg-[#1A56DB] text-white border-[#1A56DB]"
                : "bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#1A56DB]"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export default function LeadFormModal({
  isOpen,
  onClose,
  vehicle,
}: LeadFormModalProps) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [contactMethod, setContactMethod] = useState<ContactMethod | null>(null);
  const [preferredTime, setPreferredTime] = useState<PreferredTime | null>(null);
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const vehicleLabel = [vehicle.brandName, vehicle.modelName, vehicle.trimName, vehicle.variantName]
    .filter(Boolean)
    .join(" ");

  const canSubmit = fullName.trim() && phone.trim() && contactMethod;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setFullName("");
    setPhone("");
    setEmail("");
    setContactMethod(null);
    setPreferredTime(null);
    setNotes("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/50"
          />

          {/* Desktop: Centered Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="hidden md:block fixed inset-0 z-50 pointer-events-none"
          >
            <div className="flex items-center justify-center min-h-full p-4">
              <div className="pointer-events-auto bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <ModalContent
                  vehicle={vehicle}
                  vehicleLabel={vehicleLabel}
                  submitted={submitted}
                  fullName={fullName}
                  phone={phone}
                  email={email}
                  contactMethod={contactMethod}
                  preferredTime={preferredTime}
                  notes={notes}
                  canSubmit={!!canSubmit}
                  onFullNameChange={setFullName}
                  onPhoneChange={setPhone}
                  onEmailChange={setEmail}
                  onContactMethodChange={setContactMethod}
                  onPreferredTimeChange={setPreferredTime}
                  onNotesChange={setNotes}
                  onSubmit={handleSubmit}
                  onClose={handleClose}
                />
              </div>
            </div>
          </motion.div>

          {/* Mobile: Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white rounded-t-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-[#E2E8F0] rounded-full" />
            </div>
            <ModalContent
              vehicle={vehicle}
              vehicleLabel={vehicleLabel}
              submitted={submitted}
              fullName={fullName}
              phone={phone}
              email={email}
              contactMethod={contactMethod}
              preferredTime={preferredTime}
              notes={notes}
              canSubmit={!!canSubmit}
              onFullNameChange={setFullName}
              onPhoneChange={setPhone}
              onEmailChange={setEmail}
              onContactMethodChange={setContactMethod}
              onPreferredTimeChange={setPreferredTime}
              onNotesChange={setNotes}
              onSubmit={handleSubmit}
              onClose={handleClose}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ModalContent({
  vehicle,
  vehicleLabel,
  submitted,
  fullName,
  phone,
  email,
  contactMethod,
  preferredTime,
  notes,
  canSubmit,
  onFullNameChange,
  onPhoneChange,
  onEmailChange,
  onContactMethodChange,
  onPreferredTimeChange,
  onNotesChange,
  onSubmit,
  onClose,
}: {
  vehicle: VehicleContext;
  vehicleLabel: string;
  submitted: boolean;
  fullName: string;
  phone: string;
  email: string;
  contactMethod: ContactMethod | null;
  preferredTime: PreferredTime | null;
  notes: string;
  canSubmit: boolean;
  onFullNameChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onContactMethodChange: (v: ContactMethod) => void;
  onPreferredTimeChange: (v: PreferredTime) => void;
  onNotesChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}) {
  if (submitted) {
    return (
      <div className="p-6 text-center">
        <CheckCircle className="w-14 h-14 text-[#10B981] mx-auto mb-4" />
        <h2 className="text-lg font-bold text-[#1E293B] mb-2">Interest Submitted</h2>
        <p className="text-sm text-[#64748B] mb-6">
          You&apos;ve expressed interest in the {vehicleLabel}. A representative will
          contact you shortly.
        </p>
        <button
          onClick={onClose}
          className="px-6 py-2.5 bg-[#1A56DB] text-white text-sm font-bold rounded-xl hover:bg-[#1A56DB]/90 transition-colors"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-[#1E293B]">I&apos;m Interested</h2>
        <button
          onClick={onClose}
          className="p-1 text-[#64748B] hover:text-[#1E293B] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Vehicle Context Card */}
      <div className="flex items-center gap-3 bg-[#F1F5F9] rounded-lg p-3 mb-5">
        <div className="w-20 h-14 rounded overflow-hidden shrink-0">
          <PlaceholderImage aspectRatio="3/2" className="w-full h-full" />
        </div>
        <div>
          <p className="text-xs text-[#64748B]">{vehicle.brandName}</p>
          <p className="text-sm font-bold text-[#1E293B]">
            {vehicle.modelName} {vehicle.trimName}
          </p>
          {vehicle.variantName && (
            <p className="text-xs text-[#64748B]">{vehicle.variantName}</p>
          )}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="text-sm font-medium text-[#1E293B] mb-1 block">
            Full Name <span className="text-[#EF4444]">*</span>
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => onFullNameChange(e.target.value)}
            placeholder="Enter your full name"
            required
            className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1A56DB] focus:border-transparent"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="text-sm font-medium text-[#1E293B] mb-1 block">
            Phone Number <span className="text-[#EF4444]">*</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="+965 XXXX XXXX"
            required
            className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1A56DB] focus:border-transparent"
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium text-[#1E293B] mb-1 block">
            Email <span className="text-[#64748B] text-xs font-light">(optional)</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1A56DB] focus:border-transparent"
          />
        </div>

        {/* Preferred Contact Method */}
        <ChipSelect
          label="Preferred Contact Method *"
          options={["Call", "WhatsApp", "Email"] as ContactMethod[]}
          selected={contactMethod}
          onChange={onContactMethodChange}
        />

        {/* Preferred Time */}
        <ChipSelect
          label="Preferred Time"
          options={["Morning", "Afternoon", "Evening", "Anytime"] as PreferredTime[]}
          selected={preferredTime}
          onChange={onPreferredTimeChange}
        />

        {/* Notes */}
        <div>
          <label className="text-sm font-medium text-[#1E293B] mb-1 block">
            Notes <span className="text-[#64748B] text-xs font-light">(optional)</span>
          </label>
          <textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Any specific questions or preferences..."
            rows={3}
            className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1A56DB] focus:border-transparent resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full py-3 bg-[#1A56DB] text-white text-sm font-bold rounded-xl hover:bg-[#1A56DB]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Submit Interest
        </button>
      </form>
    </div>
  );
}

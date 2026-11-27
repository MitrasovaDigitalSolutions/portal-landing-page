"use client";

import { Mail, MessageCircle, Phone } from "lucide-react";
import { FormInput } from "@/components/forms/form-input";
import { FormTextarea } from "@/components/forms/form-textarea";
import { MapsLocationPicker } from "@/features/settings/components/maps-location-picker";
import type { SettingsFormValues } from "@/features/settings/schemas/settings.schema";

export function SettingsContactTab(): React.JSX.Element {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <FormInput<SettingsFormValues>
          name="phone"
          label="Nomor Telepon Resmi"
          placeholder="(0271)-6493247"
          leftIcon={<Phone className="size-4" />}
        />
        <FormInput<SettingsFormValues>
          name="whatsapp"
          label="Nomor WhatsApp CS"
          placeholder="6281234567890"
          leftIcon={<MessageCircle className="size-4" />}
          helperText="Gunakan awalan kode negara (62) tanpa spasi."
        />
        <FormInput<SettingsFormValues>
          name="email"
          label="Email Resmi"
          type="email"
          placeholder="halo@mitrasova.id"
          leftIcon={<Mail className="size-4" />}
        />
      </div>

      <FormTextarea<SettingsFormValues>
        name="address"
        label="Alamat Lengkap Kantor"
        placeholder="Jl. Sudirman Kav. 10, Jakarta Pusat..."
        rows={3}
      />

      <MapsLocationPicker />
    </div>
  );
}

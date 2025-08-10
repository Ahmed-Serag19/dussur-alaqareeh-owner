import { useState, useEffect } from "react";
import {
  X,
  Upload,
  User,
  Phone,
  CreditCard,
  FileText,
  Trash2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type {
  RealOwner,
  CreateRealOwnerRequest,
  UpdateRealOwnerRequest,
} from "../types/real-owner-response.types";
import useLanguage from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";

// Create schema based on language
const createRealOwnerSchema = (isRTL: boolean) => {
  const errorMessages = isRTL
    ? {
        fullNameRequired: "الاسم الكامل مطلوب",
        fullNameInvalid:
          "يجب أن يحتوي الاسم على اسمين على الأقل (3 أحرف لكل اسم)",
        nationalIdRequired: "الرقم الوطني مطلوب",
        phoneNumberRequired: "رقم الهاتف مطلوب",
        accountBankRequired: "اسم البنك مطلوب",
        ibanRequired: "رقم الحساب البنكي مطلوب",
      }
    : {
        fullNameRequired: "Full name is required",
        fullNameInvalid: "Name must contain at least 2 names (3+ letters each)",
        nationalIdRequired: "National ID is required",
        phoneNumberRequired: "Phone number is required",
        accountBankRequired: "Bank name is required",
        ibanRequired: "IBAN is required",
      };

  return z.object({
    fullName: z
      .string()
      .min(1, errorMessages.fullNameRequired)
      .refine((value) => {
        if (value === "string") return false;
        const names = value
          .trim()
          .split(/\s+/)
          .filter((name) => name.length > 0);
        return names.length >= 2 && names.every((name) => name.length >= 3);
      }, errorMessages.fullNameInvalid),
    nationalId: z
      .string()
      .min(1, errorMessages.nationalIdRequired)
      .refine((value) => value !== "string", "غير متاح"),
    phoneNumber: z
      .string()
      .min(1, errorMessages.phoneNumberRequired)
      .refine((value) => value !== "string", "غير متاح"),
    accountBank: z
      .string()
      .min(1, errorMessages.accountBankRequired)
      .refine((value) => value !== "string", "غير متاح"),
    iban: z
      .string()
      .min(1, errorMessages.ibanRequired)
      .refine((value) => value !== "string", "غير متاح"),
  });
};

type RealOwnerFormData = z.infer<ReturnType<typeof createRealOwnerSchema>>;

interface RealOwnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateRealOwnerRequest | UpdateRealOwnerRequest) => void;
  realOwner?: RealOwner | null;
  isLoading?: boolean;
}

export const RealOwnerModal = ({
  isOpen,
  onClose,
  onSubmit,
  realOwner,
  isLoading = false,
}: RealOwnerModalProps) => {
  const { isRTL, t } = useLanguage();
  const [ibanImage, setIbanImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Create schema based on current language
  const realOwnerSchema = createRealOwnerSchema(isRTL);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RealOwnerFormData>({
    resolver: zodResolver(realOwnerSchema),
    defaultValues: {
      fullName: realOwner?.fullName || "",
      nationalId: realOwner?.nationalId || "",
      phoneNumber: realOwner?.phoneNumber || "",
      accountBank: realOwner?.accountBank || "",
      iban: realOwner?.iban || "",
    },
  });

  const handleReset = () => {
    reset({
      fullName: "",
      nationalId: "",
      phoneNumber: "",
      accountBank: "",
      iban: "",
    });
    setIbanImage(null);
    setPreviewUrl(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  useEffect(() => {
    if (realOwner) {
      reset({
        fullName: realOwner.fullName,
        nationalId: realOwner.nationalId,
        phoneNumber: realOwner.phoneNumber,
        accountBank: realOwner.accountBank,
        iban: realOwner.iban,
      });
      // Set the existing image URL as preview
      if (realOwner.ibanImageUrl && realOwner.ibanImageUrl !== "string") {
        setPreviewUrl(realOwner.ibanImageUrl);
      } else {
        setPreviewUrl(null);
      }
      // Clear any previously selected new image
      setIbanImage(null);
    } else {
      handleReset();
    }
  }, [realOwner, reset]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIbanImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveImage = () => {
    setIbanImage(null);
    setPreviewUrl(null);
    // Reset the file input
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleFormSubmit = (data: RealOwnerFormData) => {
    if (realOwner) {
      // Update existing real owner
      const updateData: UpdateRealOwnerRequest = {
        ...data,
        ibanImageUrl: ibanImage ? null : realOwner.ibanImageUrl, // Send null if new image selected
        ibanImage: ibanImage || undefined, // Send the image if selected
      };
      onSubmit(updateData);
    } else {
      // Create new real owner
      const createData: CreateRealOwnerRequest = {
        realowner: data,
        ibanImage: ibanImage || undefined, // Send the image if selected
      };
      onSubmit(createData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/60 transition-opacity"
          onClick={onClose}
        />
        <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {realOwner ? t("common.edit") : t("realOwners.addNew")}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="p-6 space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {t("realOwners.form.fullName")}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    {...register("fullName")}
                    type="text"
                    placeholder={t("realOwners.form.fullNamePlaceholder")}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.fullName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-sm text-red-600">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* National ID */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {t("realOwners.form.nationalId")}
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    {...register("nationalId")}
                    type="text"
                    placeholder={t("realOwners.form.nationalIdPlaceholder")}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.nationalId ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
                {errors.nationalId && (
                  <p className="text-sm text-red-600">
                    {errors.nationalId.message}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {t("realOwners.form.phoneNumber")}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    {...register("phoneNumber")}
                    type="tel"
                    placeholder={t("realOwners.form.phoneNumberPlaceholder")}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.phoneNumber ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="text-sm text-red-600">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              {/* Bank Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {t("realOwners.form.accountBank")}
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    {...register("accountBank")}
                    type="text"
                    placeholder={t("realOwners.form.accountBankPlaceholder")}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.accountBank ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
                {errors.accountBank && (
                  <p className="text-sm text-red-600">
                    {errors.accountBank.message}
                  </p>
                )}
              </div>

              {/* IBAN */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  {t("realOwners.form.iban")}
                </label>
                <input
                  {...register("iban")}
                  type="text"
                  placeholder={t("realOwners.form.ibanPlaceholder")}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.iban ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.iban && (
                  <p className="text-sm text-red-600">{errors.iban.message}</p>
                )}
              </div>

              {/* IBAN Image Upload */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  {t("realOwners.form.ibanImage")}
                </label>
                <div className="space-y-4">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">
                            {realOwner
                              ? t("common.clickToChange")
                              : t("common.clickToUpload")}
                          </span>{" "}
                          {t("common.orDragAndDrop")}
                        </p>
                        <p className="text-xs text-gray-500">
                          {realOwner
                            ? t("realOwners.form.ibanImageChangePlaceholder") ||
                              "Click to change the IBAN image"
                            : t("realOwners.form.ibanImagePlaceholder")}
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {previewUrl && (
                    <div className="mt-4 relative">
                      <img
                        src={previewUrl}
                        alt="IBAN Preview"
                        className="w-full h-32 object-contain border rounded-lg"
                      />
                      <button
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        title={t("realOwners.form.removeImage")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading
                  ? t("common.saving")
                  : realOwner
                  ? t("common.save")
                  : t("common.add")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

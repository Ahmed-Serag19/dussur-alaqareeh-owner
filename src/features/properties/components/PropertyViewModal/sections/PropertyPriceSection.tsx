import useLanguage from "@/hooks/useLanguage";

interface PropertyPriceSectionProps {
  price: number;
}

export const PropertyPriceSection = ({ price }: PropertyPriceSectionProps) => {
  const { isRTL } = useLanguage();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(isRTL ? "ar-SA" : "en-US").format(price);
  };

  return (
    <div className="text-center py-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
      <div className="text-4xl font-bold text-stone-800">
        {formatPrice(price)} {isRTL ? "ريال سعودي" : "SAR"}
      </div>
    </div>
  );
};

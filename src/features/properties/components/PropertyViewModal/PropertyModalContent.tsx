import type { Property } from "../../types/property-response.types";
import { PropertyPriceSection } from "./sections/PropertyPriceSection";
import { PropertyGeneralInfo } from "./sections/PropertyGeneralInfo";
import { PropertySpecifications } from "./sections/PropertySpecifications";
import { PropertyLocationDetails } from "./sections/PropertyLocationDetails";
import { PropertySystemInfo } from "./sections/PropertySystemInfo";

interface PropertyModalContentProps {
  property: Property;
}

export const PropertyModalContent = ({
  property,
}: PropertyModalContentProps) => {
  return (
    <div className="p-6 space-y-8">
      <PropertyPriceSection price={property.price} />
      <PropertyGeneralInfo property={property} />
      <PropertySpecifications property={property} />
      <PropertyLocationDetails property={property} />
      <PropertySystemInfo property={property} />
    </div>
  );
};

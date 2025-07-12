import { useState } from "react";
import { MapPin, Map } from "lucide-react";
import type { Property } from "@/features/properties/types/property-response.types";
import { useLookupData } from "@/features/properties/hooks/useLookupData";
import useLanguage from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { MiniMapModal } from "@/features/properties/components/PropertyViewModal/MiniMapModal";
import { useReverseGeocode } from "../hooks/useReverseGeocode";

interface PropertyLocationDetailsProps {
  property: Property;
}

export const PropertyLocationDetails = ({
  property,
}: PropertyLocationDetailsProps) => {
  const { isRTL, t } = useLanguage();
  const { getRegionName, getCityName, getNeighborhoodName } = useLookupData();
  const [mapOpen, setMapOpen] = useState(false);
  const { data: address } = useReverseGeocode(
    property.latitude,
    property.longitude
  );
  return (
    <div className={`space-y-4 ${isRTL ? "text-right" : "text-left"}`}>
      <h3
        className={`text-lg font-semibold flex items-center gap-2 ${
          isRTL ? "justify-end" : ""
        }`}
      >
        <MapPin className="h-5 w-5" />
        {t("properties.viewModal.locationDetails")}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            {t("properties.region")}
          </label>
          <p>{getRegionName(property.regionId) || t("common.notSpecified")}</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            {t("properties.city")}
          </label>
          <p>{getCityName(property.cityId) || t("common.notSpecified")}</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            {t("properties.neighborhood")}
          </label>
          <p>
            {getNeighborhoodName(property.neighborhoodId) ||
              t("common.notSpecified")}
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            {t("properties.streetAr")}
          </label>
          <p>{property.streetAr || t("common.notSpecified")}</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            {t("properties.streetEn")}
          </label>
          <p>{property.streetEn || t("common.notSpecified")}</p>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-muted-foreground">
            {t("properties.viewModal.coordinates")}
          </label>
          <div className="flex items-center justify-between gap-2">
            <p className="max-w-md">{address} </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMapOpen(true)}
            >
              <Map className="w-4 h-4 mr-1" />
              {t("properties.viewModal.viewOnMap")}
            </Button>
          </div>
          <MiniMapModal
            isOpen={mapOpen}
            onClose={() => setMapOpen(false)}
            lat={property.latitude}
            lng={property.longitude}
          />
        </div>
      </div>
    </div>
  );
};

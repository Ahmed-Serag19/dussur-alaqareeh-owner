// src/hooks/useReverseGeocode.ts
import { useQuery } from "@tanstack/react-query";
import i18n from "@/i18n/i18n";

export const useReverseGeocode = (lat: number, lng: number) => {
  const lang = i18n.language || "en";

  return useQuery({
    queryKey: ["reverse-geocode", lat, lng, lang],
    queryFn: async () => {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
        {
          headers: {
            "Accept-Language": lang === "ar" ? "ar" : "en",
          },
        }
      );
      const data = await res.json();
      return data.display_name as string;
    },
    enabled: !!lat && !!lng,
    staleTime: 1000 * 60 * 5,
  });
};

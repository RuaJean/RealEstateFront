import { useEffect, useState } from "react";
import type { Property } from "@/models/Property";

export function useProperties(): { properties: Property[]; setProperties: (p: Property[]) => void } {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    // Ejemplo: aquí podrías hacer fetch y tipar la respuesta como Property[]
    // setProperties(data as Property[]);
  }, []);

  return { properties, setProperties };
}



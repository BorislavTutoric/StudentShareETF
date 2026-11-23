import { useEffect, useRef, useState } from "react";

// Učitava podatke kad god se promijeni `kljuc` (npr. filteri).
// Vraća { kljuc, data, error }: dok je rezultat.kljuc različit od trenutnog ključa, učitavanje traje.
// Prethodni podaci ostaju prikazani dok stižu novi, a odgovori zastarjelih zahtjeva se ignorišu.
export default function useUcitavanje(kljuc, ucitaj, porukaGreske) {
  const [rezultat, setRezultat] = useState({ kljuc: null, data: null, error: null });
  const ucitajRef = useRef(ucitaj);

  useEffect(() => { ucitajRef.current = ucitaj; });

  useEffect(() => {
    if (kljuc == null) return undefined;
    let aktuelan = true;
    ucitajRef.current()
      .then((data) => { if (aktuelan) setRezultat({ kljuc, data, error: null }); })
      .catch((err) => {
        console.error(err);
        if (aktuelan) setRezultat((prev) => ({ kljuc, data: prev.data, error: porukaGreske }));
      });
    return () => { aktuelan = false; };
  }, [kljuc, porukaGreske]);

  return rezultat;
}

package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.utils;

import java.util.*;


public class CyrillicToLatinConverter {

    private static final Map<String, String> MAP = new LinkedHashMap<>();

    static {
        MAP.put("Љ", "Lj"); MAP.put("љ", "lj");
        MAP.put("Њ", "Nj"); MAP.put("њ", "nj");
        MAP.put("Џ", "Dž"); MAP.put("џ", "dž");

        MAP.put("А", "A"); MAP.put("а", "a");
        MAP.put("Б", "B"); MAP.put("б", "b");
        MAP.put("В", "V"); MAP.put("в", "v");
        MAP.put("Г", "G"); MAP.put("г", "g");
        MAP.put("Д", "D"); MAP.put("д", "d");
        MAP.put("Ђ", "Đ"); MAP.put("ђ", "đ");
        MAP.put("Е", "E"); MAP.put("е", "e");
        MAP.put("Ж", "Ž"); MAP.put("ж", "ž");
        MAP.put("З", "Z"); MAP.put("з", "z");
        MAP.put("И", "I"); MAP.put("и", "i");
        MAP.put("Ј", "J"); MAP.put("ј", "j");
        MAP.put("К", "K"); MAP.put("к", "k");
        MAP.put("Л", "L"); MAP.put("л", "l");
        MAP.put("М", "M"); MAP.put("м", "m");
        MAP.put("Н", "N"); MAP.put("н", "n");
        MAP.put("О", "O"); MAP.put("о", "o");
        MAP.put("П", "P"); MAP.put("п", "p");
        MAP.put("Р", "R"); MAP.put("р", "r");
        MAP.put("С", "S"); MAP.put("с", "s");
        MAP.put("Т", "T"); MAP.put("т", "t");
        MAP.put("Ћ", "Ć"); MAP.put("ћ", "ć");
        MAP.put("У", "U"); MAP.put("у", "u");
        MAP.put("Ф", "F"); MAP.put("ф", "f");
        MAP.put("Х", "H"); MAP.put("х", "h");
        MAP.put("Ц", "C"); MAP.put("ц", "c");
        MAP.put("Ч", "Č"); MAP.put("ч", "č");
        MAP.put("Ш", "Š"); MAP.put("ш", "š");
    }

    public static String toLatinUpper(String text) {
        for (Map.Entry<String, String> e : MAP.entrySet()) {
            text = text.replace(e.getKey(), e.getValue());
        }
        return text.toUpperCase();
    }
}

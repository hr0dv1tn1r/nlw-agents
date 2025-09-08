import lib from "dayjs";
import "dayjs/locale/pt-br";
import relativeTime from "dayjs/plugin/relativeTime";

lib.locale("pt-BR");
lib.extend(relativeTime);
// Habilita plugin para exibir tempo relativo (ex: "há 2 minutos").

export const dayjs = lib;

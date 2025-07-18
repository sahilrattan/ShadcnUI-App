import { TypeOrmConnection } from "@auto-relay/typeorm";
import { AutoRelayConfig } from "auto-relay";

export const autoRelay = new AutoRelayConfig({ orm: () => TypeOrmConnection });

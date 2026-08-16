"use client";

import { useEffect } from "react";
import type { GearItem } from "@/lib/types";
import { recordLine, startContact } from "@/lib/contactsStore";
import { firstContactReplies } from "@/lib/data/demoScript";
import { Conversation, type ChatPartner } from "./Conversation";
import type { BookableDay } from "@/lib/types";

/**
 * A conversation with somebody you haven't messaged before.
 *
 * Everything the chat needs — availability, rate, gear — comes from the server
 * as normal props, so booking and the shopping drawer work exactly as they do
 * in a seeded thread. The only thing kept in the browser is the fact that this
 * conversation exists, so it can show up in the inbox.
 */
export function DirectThread({
  partner,
  gearItems,
  days,
}: {
  partner: ChatPartner;
  gearItems: GearItem[];
  days: BookableDay[];
}) {
  useEffect(() => {
    startContact({
      slug: partner.slug,
      name: partner.name,
      initials: partner.initials,
      tone: partner.tone,
      skill: partner.skill,
    });
  }, [partner]);

  return (
    <Conversation
      partner={partner}
      initialMessages={[]}
      gearItems={gearItems}
      demo={firstContactReplies}
      days={days}
      onSend={(text) => recordLine(partner.slug, text)}
    />
  );
}

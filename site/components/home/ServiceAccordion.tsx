"use client";

import { useState } from "react";
import type { ServiceCard } from "@/content/types";
import { ArrowRight, ArrowUpRight } from "../icons";

// Independently expandable service rows. The first item starts open so the
// interaction and available detail are discoverable without requiring hover.
export function ServiceAccordion({ services }: { services: ServiceCard[] }) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(services[0] ? [services[0].id] : []),
  );

  const toggle = (id: string) => {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="services-list">
      {services.map((service, i) => {
        const expanded = expandedIds.has(service.id);
        const panelId = `service-panel-${service.id}`;
        return (
          <div
            className={`service-row${expanded ? " is-expanded" : ""}`}
            key={service.id}
            data-reveal
          >
            <button
              className="service-btn"
              type="button"
              aria-expanded={expanded}
              aria-controls={panelId}
              onClick={() => toggle(service.id)}
            >
              <span className="service-title">
                <span className="service-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="service-name">{service.title}</span>
              </span>
              <span className="arr" aria-hidden="true">
                {expanded ? <ArrowRight /> : <ArrowUpRight />}
              </span>
            </button>
            <div
              className="service-detail-shell"
              id={panelId}
              aria-hidden={!expanded}
            >
              <div className="service-detail-clip">
                <div className="service-detail">
                  <p>{service.description}</p>
                  {service.tags.length > 0 && (
                    <div className="service-tags">
                      {service.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

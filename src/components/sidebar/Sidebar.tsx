import { PageTab } from "@/AppTypes";
import { Toggle } from "../ui/toggle";
import { Button } from "../ui/button";

import { observer } from "mobx-react-lite";
import { CollectionsStore } from "@/CollectionsStore";

interface IProps {
  selectedTab: PageTab;
  onTabSelect(tag: PageTab): void;
  onImportClick(): void;
}

export const Sidebar = observer(
  ({ selectedTab, onTabSelect, onImportClick }: IProps) => {
    return (
      <div className="bg-primary0 min-w-80 p-2">
        <div className="border-b-1 mb-5">
          <Toggle
            variant="outline"
            aria-label="Show Map"
            pressed={selectedTab === PageTab.Map}
            onPressedChange={() => onTabSelect(PageTab.Map)}
          >
            Map
          </Toggle>
          <Toggle
            variant="outline"
            aria-label="Show Table"
            pressed={selectedTab === PageTab.Table}
            onPressedChange={() => onTabSelect(PageTab.Table)}
          >
            Table
          </Toggle>
          <Button variant="outline" onClick={onImportClick}>
            Import
          </Button>
        </div>
        Collections:
        <br />
        {CollectionsStore.collections.map((collection) => (
          <>
            {collection.label}
            <ul className="list-disc pl-5">
              {collection.tables.map((table) => (
                <li>{table.label}</li>
              ))}
            </ul>
          </>
        ))}
      </div>
    );
  }
);

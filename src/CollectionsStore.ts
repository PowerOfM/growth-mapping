import { action, makeObservable, observable } from "mobx";
import { ICollection, ITable } from "./DataTypes";
import { LoggerBuilder } from "./lib/Logger";

class CollectionsStoreClass {
  public collections: ICollection[] = [];
  private log = LoggerBuilder.build("CollectionStore");

  constructor() {
    makeObservable(this, {
      collections: observable,
      addTable: action,
      addCollection: action,
    });
  }

  public addTable(collectionId: string, value: ITable) {
    const targetIndex = this.collections.findIndex(
      (entry) => entry.id === collectionId
    );

    let target = this.collections[targetIndex];
    if (!target) {
      this.log.warn(
        "Could not find collection with ID:",
        collectionId,
        "Creating new collection."
      );
      target = {
        id: crypto.randomUUID(),
        label: "Other Tables",
        tables: [],
      };
      this.addCollection(target);
    }

    if (value.label === "Table") {
      value.label += " " + (target.tables.length + 1);
    }

    target.tables.push(value);
    this.log("Added table", value);
  }

  public addCollection(value: ICollection) {
    this.collections.push(value);
    this.log("Added collection", value);
  }
}

export const CollectionsStore = new CollectionsStoreClass();

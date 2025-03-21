import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Principal "mo:base/Principal";
import Types "./types";
import Utils "./utils";

actor LinkShortener {
  stable var storageList : [(Text, Types.ShortLink)] = [];

  func getStorageMap() : HashMap.HashMap<Text, Types.ShortLink> {
    let map = HashMap.HashMap<Text, Types.ShortLink>(10, Text.equal, Text.hash);
    for ((id, link) in storageList.vals()) {
      map.put(id, link);
    };
    return map;
  };

  public shared ({ caller }) func shortenUrl(originalUrl : Text) : async Text {
    let id = Utils.generateId(originalUrl);
    let now = Time.now();
    let creator = if (Principal.isAnonymous(caller)) { null } else { ?caller };

    let newLink : Types.ShortLink = {
      id = id;
      originalUrl = originalUrl;
      creator = creator;
      createdAt = now;
      clickCount = 0;
    };

    storageList := Array.append(storageList, [(id, newLink)]);
    return newLink.id;
  };

  public shared func getOriginalUrl(id : Text) : async ?Text {
    let storage = getStorageMap();
    switch (storage.get(id)) {
      case (?link) {
        let updatedLink : Types.ShortLink = {
          id = link.id;
          originalUrl = link.originalUrl;
          creator = link.creator;
          createdAt = link.createdAt;
          clickCount = link.clickCount + 1;
        };

        storageList := Array.map<(Text, Types.ShortLink), (Text, Types.ShortLink)>(
          storageList,
          func((key, value)) {
            if (key == id) {
              (key, updatedLink);
            } else {
              (key, value);
            };
          },
        );

        return ?updatedLink.originalUrl;
      };
      case null { return null };
    };
  };

  public shared func getAllLinks() : async [(Text, Types.ShortLink)] {
    return storageList;
  };

  public shared ({ caller }) func getLinksByCreator() : async [(Text, Types.ShortLink)] {
    if (Principal.isAnonymous(caller)) {
      return [];
    };
    let creatorLinks = Iter.filter<(Text, Types.ShortLink)>(
      storageList.vals(),
      func((_, link)) {
        link.creator == ?caller;
      },
    );
    return Iter.toArray(creatorLinks);
  };

  public shared ({ caller }) func deleteLink(id : Text) : async Bool {
    if (Principal.isAnonymous(caller)) {
      return false;
    };
    let storage = getStorageMap();
    switch (storage.get(id)) {
      case (?link) {
        if (link.creator == ?caller) {
          let newList = Iter.filter<(Text, Types.ShortLink)>(storageList.vals(), func((key, _)) { key != id });
          storageList := Iter.toArray(newList);
          return true;
        } else {
          return false;
        };
      };
      case null { return false };
    };
  };
};

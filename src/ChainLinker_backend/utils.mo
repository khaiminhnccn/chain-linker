import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";

module {
    public func generateId(url : Text) : Text {
        let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let charArray = Text.toArray(charset);
        let base = charArray.size();
        var hashNat : Nat = Nat32.toNat(Text.hash(url));
        var id = "";

        while (hashNat > 0) {
            let index = hashNat % base;
            let char = charArray[index];
            id := Text.concat(Text.fromChar(char), id);
            hashNat /= base;
        };

        if (Text.size(id) == 0) {
            id := "a";
        };

        return id;
    };
};

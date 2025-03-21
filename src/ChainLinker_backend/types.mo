module {
    public type ShortLink = {
        id : Text;
        originalUrl : Text;
        creator : ?Principal;
        createdAt : Int;
        clickCount : Nat;
    };
};

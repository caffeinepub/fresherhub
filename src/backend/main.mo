import Array "mo:core/Array";
import List "mo:core/List";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type Article = {
    id : Nat;
    title : Text;
    content : Text;
    category : Text;
    tags : [Text];
    isPinned : Bool;
    createdAt : Int;
    updatedAt : Int;
    authorName : Text;
  };

  module Article {
    public func compare(article1 : Article, article2 : Article) : Order.Order {
      Nat.compare(article1.id, article2.id);
    };
  };

  public type UserProfile = {
    name : Text;
  };

  let categories = ["Getting Started", "Best Practices", "Tools & Setup", "Career Tips", "FAQs"];

  let articleStore = Map.empty<Nat, Article>();
  var nextId = 1;

  // Initialize the user system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func createArticle(title : Text, content : Text, category : Text, tags : [Text], authorName : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create articles");
    };
    if (not categories.values().any(func(cat) { cat == category })) {
      Runtime.trap("Invalid category");
    };

    let article : Article = {
      id = nextId;
      title;
      content;
      category;
      tags;
      isPinned = false;
      createdAt = Time.now();
      updatedAt = Time.now();
      authorName;
    };

    articleStore.add(nextId, article);
    nextId += 1;
  };

  public shared ({ caller }) func updateArticle(id : Nat, title : Text, content : Text, category : Text, tags : [Text], authorName : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update articles");
    };
    if (not categories.values().any(func(cat) { cat == category })) {
      Runtime.trap("Invalid category");
    };

    switch (articleStore.get(id)) {
      case (null) { Runtime.trap("Article not found") };
      case (?existing) {
        let updated : Article = {
          id;
          title;
          content;
          category;
          tags;
          isPinned = existing.isPinned;
          createdAt = existing.createdAt;
          updatedAt = Time.now();
          authorName;
        };
        articleStore.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func deleteArticle(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete articles");
    };
    if (not articleStore.containsKey(id)) { Runtime.trap("Article not found") };
    articleStore.remove(id);
  };

  public query func getArticles(category : ?Text) : async [Article] {
    let articles = articleStore.values().toArray();

    switch (category) {
      case (null) { return articles };
      case (?cat) {
        if (not categories.values().any(func(c) { c == cat })) {
          Runtime.trap("Invalid category");
        };
        return articles.filter(
          func(article) { article.category == cat }
        );
      };
    };
  };

  public query func getArticle(id : Nat) : async Article {
    switch (articleStore.get(id)) {
      case (null) { Runtime.trap("Article not found") };
      case (?article) { article };
    };
  };

  public query func searchArticles(keyword : Text) : async [Article] {
    let articles = articleStore.values().toArray();

    articles.filter(
      func(article) {
        article.title.toLower().contains(#text(keyword.toLower())) or
        article.content.toLower().contains(#text(keyword.toLower()));
      }
    );
  };

  public shared ({ caller }) func pinArticle(id : Nat, isPinned : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can pin articles");
    };

    switch (articleStore.get(id)) {
      case (null) { Runtime.trap("Article not found") };
      case (?existing) {
        let updated : Article = {
          id;
          title = existing.title;
          content = existing.content;
          category = existing.category;
          tags = existing.tags;
          isPinned;
          createdAt = existing.createdAt;
          updatedAt = Time.now();
          authorName = existing.authorName;
        };
        articleStore.add(id, updated);
      };
    };
  };

  public query func getCategories() : async [(Text, Nat)] {
    categories.map(
      func(cat) {
        let count = articleStore.values().toArray().filter(
          func(article) { article.category == cat }
        ).size();
        (cat, count);
      }
    );
  };
};

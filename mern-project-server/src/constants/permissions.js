const permissions = {
  admin: [
    "user:create",
    "user:read",
    "user:update",
    "user:delete",
    "link:create",
    "link:read",
    "link:update",
    "link:delete",
  ],
  developer: ["link:read"],
  viewer: ["link:read", "user:read"],
};
module.exports = permissions;
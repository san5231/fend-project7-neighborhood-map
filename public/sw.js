const static_cache = "cache-v1";
const image_cache = "image-cache-v1";
const other_cache = "other-cache-v1";
const allCaches = [static_cache, image_cache, other_cache];

function isImageURL(url) {
  let img_types = ["jpg", "jpeg", "png", "gif"];
  var isImage = false;
  for (let type of img_types) {
    if (url.endsWith(type)) {
      isImage = true;
      break;
    }
  }
  return isImage;
}

function storeInCache(cacheName, requestClone, responseClone) {
  return caches.open(cacheName).then(function(cache) {
    return cache.put(requestClone, responseClone);
  });
}

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(static_cache).then(function(cache) {
      console.log("Current Cache: ", static_cache);
      return cache.addAll(["/", "/index.html"]);
    })
  );
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      console.log("Clearing Old Caches...");
      Promise.all(
        cacheNames.map(function(cacheName) {
          if (!allCaches.includes(cacheName)) {
            console.log(`Deleting: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", function(event) {
  if (event.request.method === "GET") {
    event.respondWith(
      caches.match(event.request).then(function(result) {
        if (result) {
          return result;
        }
        var url = new URL(event.request.url);
        try {
          return fetch(event.request).then(function(response) {
            let useCache = isImageURL(event.request.url)
              ? image_cache
              : static_cache;
            storeInCache(useCache, event.request.clone(), response.clone());
            return response;
          });
        } catch (e) {
          console.log(e);
        }
      })
    );
  } else {
    event.respondWith(fetch(event.request));
  }
});

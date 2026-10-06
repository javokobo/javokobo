
document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var sidebar = document.querySelector(".sidebar");
  if (toggle && sidebar) {
    toggle.addEventListener("click", function () {
      sidebar.classList.toggle("open");
      var expanded = sidebar.classList.contains("open");
      toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
    });
  }


  var modal = document.getElementById("creditModal");
  var links = document.querySelectorAll(".js-download-link");
  if (modal && links.length) {
    var fileNameEl = document.getElementById("modalFileName");
    var downloadBtn = document.getElementById("modalDownloadBtn");
    var closeBtn = document.getElementById("modalCloseBtn");
    var copyBtn = document.getElementById("modalCopyBtn");
    var pendingHref = "";
    var pendingBlank = false;

    function fallbackCopy(text) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch (err) {}
      document.body.removeChild(ta);
    }

    function markCopied() {
      var original = copyBtn.textContent;
      copyBtn.textContent = "コピーしました！";
      copyBtn.classList.add("is-copied");
      setTimeout(function () {
        copyBtn.textContent = original;
        copyBtn.classList.remove("is-copied");
      }, 1500);
    }

    function openModal(link) {
      pendingHref = link.getAttribute("href");
      pendingBlank = link.getAttribute("target") === "_blank";
      fileNameEl.textContent = link.dataset.filename || link.textContent.trim();
      modal.hidden = false;
    }

    function closeModal() {
      modal.hidden = true;
    }

    links.forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        openModal(link);
      });
    });

    downloadBtn.addEventListener("click", function () {
      closeModal();
      if (pendingBlank) {
        window.open(pendingHref, "_blank");
      } else {
        window.location.href = pendingHref;
      }
    });

    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal();
    });

    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        var creditText = fileNameEl.textContent + " by 1danieldossantos.github.io";
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(creditText).then(markCopied, function () {
            fallbackCopy(creditText);
            markCopied();
          });
        } else {
          fallbackCopy(creditText);
          markCopied();
        }
      });
    }
  }

  
  document.querySelectorAll(".gallery-grid").forEach(function (grid) {
    var pagination = grid.parentElement.querySelector(".gallery-pagination");
    if (!pagination) return;

    var items = Array.prototype.filter.call(grid.children, function (el) {
      return el.classList.contains("gallery-item");
    });
    var perPage = parseInt(grid.dataset.perPage, 10) || 6;
    var totalPages = Math.max(1, Math.ceil(items.length / perPage));

    if (totalPages <= 1) {
      pagination.hidden = true;
      return;
    }

    var pageInfo = pagination.querySelector(".gallery-page-info");
    var prevBtn = pagination.querySelector(".gallery-prev-btn");
    var nextBtn = pagination.querySelector(".gallery-next-btn");
    var currentPage = 1;

    function render() {
      items.forEach(function (item, index) {
        var page = Math.floor(index / perPage) + 1;
        item.style.display = page === currentPage ? "" : "none";
      });
      pageInfo.textContent = currentPage + " / " + totalPages + " ページ";
      prevBtn.disabled = currentPage === 1;
      nextBtn.disabled = currentPage === totalPages;
    }

    prevBtn.addEventListener("click", function () {
      if (currentPage > 1) {
        currentPage--;
        render();
      }
    });
    nextBtn.addEventListener("click", function () {
      if (currentPage < totalPages) {
        currentPage++;
        render();
      }
    });

    pagination.hidden = false;
    render();
  });
});

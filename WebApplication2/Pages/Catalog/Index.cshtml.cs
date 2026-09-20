using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace WebApplication2.Pages.Catalog
{
    public class IndexModel : PageModel
    {
        public List<CatalogItem> Products { get; set; } = new();
        public List<string> Tags { get; set; } = new();
        public string? SelectedTag { get; set; }

        // ===================== ОБЫЧНЫЙ GET =====================
        public void OnGet(string? tag)
        {
            SelectedTag = string.IsNullOrWhiteSpace(tag) ? null : tag;
            Tags = ProductCatalog.AllTags;
            Products = ProductCatalog.FilterByTag(SelectedTag);
        }

        // ===================== 1.1. ПОИСК → HTML-фрагмент =====================
        // GET /Catalog?handler=Search&query=ноут
        public IActionResult OnGetSearch(string? query)
        {
            var products = ProductCatalog.All;

            if (!string.IsNullOrWhiteSpace(query))
            {
                var q = query.Trim().ToLower();
                products = products.Where(p =>
                    p.Name.ToLower().Contains(q) ||
                    p.Description.ToLower().Contains(q)
                ).ToList();
            }

            // Возвращаем partial без layout
            return Partial("_ProductList", products);
        }

        // ===================== 1.2. ДОБАВИТЬ В КОРЗИНУ → JSON =====================
        // POST /Catalog?handler=AddToCart
        public IActionResult OnPostAddToCart(int id)
        {
            var product = ProductCatalog.Find(id);
            if (product == null)
            {
                return new JsonResult(new { success = false, message = "Товар не найден" });
            }

            // Корзина в сессии как строка "1,2,5,3"
            var cart = HttpContext.Session.GetString("Cart");
            var items = string.IsNullOrEmpty(cart)
                ? new List<int>()
                : cart.Split(',', StringSplitOptions.RemoveEmptyEntries)
                      .Select(int.Parse)
                      .ToList();

            items.Add(id);
            HttpContext.Session.SetString("Cart", string.Join(',', items));

            return new JsonResult(new
            {
                success = true,
                cartCount = items.Count,
                productName = product.Name
            });
        }

        // ===================== 1.3. СЧЁТЧИК КОРЗИНЫ → JSON =====================
        // GET /Catalog?handler=GetCartCount
        public IActionResult OnGetGetCartCount()
        {
            var cart = HttpContext.Session.GetString("Cart");
            var count = string.IsNullOrEmpty(cart)
                ? 0
                : cart.Split(',', StringSplitOptions.RemoveEmptyEntries).Length;

            return new JsonResult(new { count });
        }
    }
}
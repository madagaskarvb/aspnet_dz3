using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace WebApplication2.Pages.Cart
{
    public class CartLine
    {
        public int ProductId { get; set; }
        public string Name { get; set; } = "";
        public decimal Price { get; set; }
        public int Quantity { get; set; }

        public decimal Subtotal => Price * Quantity;
    }

    public class IndexModel : PageModel
    {
        // Корзина в статике — живёт до перезапуска приложения
        private static readonly List<CartLine> _cart = new();

        public List<CartLine> Items => _cart;
        public decimal TotalAmount => _cart.Sum(x => x.Subtotal);

        [TempData] public string? FlashMessage { get; set; }
        [TempData] public string? FlashType { get; set; }

        public void OnGet()
        {
            if (string.IsNullOrEmpty(FlashMessage) && _cart.Count == 0)
            {
                FlashMessage = "Корзина пуста";
                FlashType = "warning";
            }
        }

        // POST /Cart?handler=Add&id=3
        public IActionResult OnPostAdd(int id)
        {
            var product = ProductCatalog.Find(id);
            if (product == null)
            {
                FlashMessage = "Товар не найден";
                FlashType = "warning";
                return RedirectToPage();
            }

            var line = _cart.FirstOrDefault(x => x.ProductId == id);
            if (line == null)
            {
                _cart.Add(new CartLine
                {
                    ProductId = product.Id,
                    Name = product.Name,
                    Price = product.Price,
                    Quantity = 1
                });
            }
            else
            {
                line.Quantity++;
            }

            FlashMessage = $"«{product.Name}» добавлен в корзину";
            FlashType = "success";

            // По умолчанию возвращаемся на страницу корзины.
            // Если товар добавляли из каталога — вернёмся на каталог.
            var returnUrl = Request.Form["returnUrl"].ToString();
            if (!string.IsNullOrEmpty(returnUrl) && Url.IsLocalUrl(returnUrl))
                return Redirect(returnUrl);

            return RedirectToPage();
        }

        public IActionResult OnPostClear()
        {
            _cart.Clear();
            FlashMessage = "Корзина очищена";
            FlashType = "warning";
            return RedirectToPage();
        }

        public IActionResult OnPostConfirm()
        {
            _cart.Clear();
            FlashMessage = "Заказ успешно оформлен! Спасибо за покупку.";
            FlashType = "success";
            return RedirectToPage();
        }
    }
}
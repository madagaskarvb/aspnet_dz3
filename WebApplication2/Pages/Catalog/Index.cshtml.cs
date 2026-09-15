using Microsoft.AspNetCore.Mvc.RazorPages;

namespace WebApplication2.Pages.Catalog
{
    public class IndexModel : PageModel
    {
        public List<CatalogItem> Products { get; set; } = new();
        public List<string> Tags { get; set; } = new();

        // Выбранный тег из query-строки
        public string? SelectedTag { get; set; }

        public void OnGet(string? tag)
        {
            SelectedTag = string.IsNullOrWhiteSpace(tag) ? null : tag;

            Tags = ProductCatalog.AllTags;
            Products = ProductCatalog.FilterByTag(SelectedTag);
        }
    }
}
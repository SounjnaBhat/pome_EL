"""
Generate publication-quality comparison graph of popular applications.
Creates a grouped bar chart comparing apps by Monthly Active Users (MAU).
"""

import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np
from pathlib import Path

# Try to import seaborn for better styling (optional)
try:
    import seaborn as sns
    plt.style.use('seaborn-v0_8-paper')
    sns.set_palette("husl")
    HAS_SEABORN = True
except ImportError:
    HAS_SEABORN = False
    plt.style.use('default')
    # Set matplotlib params for publication quality
    plt.rcParams.update({
        'font.size': 11,
        'axes.labelsize': 12,
        'axes.titlesize': 14,
        'xtick.labelsize': 10,
        'ytick.labelsize': 10,
        'legend.fontsize': 10,
        'figure.titlesize': 16,
        'font.family': 'sans-serif',
        'figure.dpi': 100,
    })

# Configuration
DATA_PATH = Path(__file__).parent / "data" / "apps_master_dataset_updated.csv"
OUTPUT_DIR = Path(__file__).parent / "data" / "graphs"
OUTPUT_DIR.mkdir(exist_ok=True, parents=True)

# If updated dataset doesn't exist, use original
if not DATA_PATH.exists():
    DATA_PATH = Path(__file__).parent / "data" / "apps_master_dataset.csv"

# Color mapping for domains
DOMAIN_COLORS = {
    "Search": "#4285F4",  # Google Blue
    "Video": "#FF0000",  # YouTube Red
    "Communication": "#25D366",  # WhatsApp Green
    "Social Media": "#1877F2",  # Facebook Blue
    "Email": "#EA4335",  # Gmail Red
    "Navigation": "#34A853",  # Google Green
    "Cloud Storage": "#FBBC04",  # Google Yellow
    "E-Commerce": "#FF9900",  # Amazon Orange
    "Messaging": "#0088CC",  # Telegram Blue
    "Entertainment": "#E50914",  # Netflix Red
    "Music": "#1DB954",  # Spotify Green
    "Professional": "#0077B5",  # LinkedIn Blue
    "Community": "#FF4500",  # Reddit Orange
    "Travel": "#00A699",  # Airbnb Teal
    "Finance": "#003087",  # PayPal Blue
    "Collaboration": "#4A154B",  # Slack Purple
    "Productivity": "#0078D4",  # Microsoft Blue
    "Browser": "#FF7139",  # Firefox Orange
    "Education": "#98CE00",  # Duolingo Green
    "Health": "#00B0B9",  # Fitbit Cyan
    "Design": "#00C4CC",  # Canva Cyan
    "Knowledge": "#A82400",  # Quora Red
    "Blogging": "#00C471",  # Medium Green
    "Food Delivery": "#FC8019",  # Zomato Orange
    "AI / Assistant": "#4285F4",  # Google Blue
    "Utility": "#636E72",  # Gray
}

def load_data():
    """Load the updated dataset."""
    # Try updated dataset first, fallback to original
    data_path = DATA_PATH
    if not data_path.exists():
        data_path = Path(__file__).parent / "data" / "apps_master_dataset.csv"
    
    df = pd.read_csv(data_path)
    
    # Filter to only apps with global rank (top 100)
    df = df[df["global_rank"].notna()].copy()
    
    # Remove duplicates - keep first occurrence (highest priority)
    df = df.drop_duplicates(subset=["app_name"], keep="first")
    
    # Sort by global rank
    df = df.sort_values("global_rank", ascending=True)
    
    return df

def create_comparison_graph(df, top_n=50, save_path=None):
    """
    Create a grouped bar chart comparing apps by MAU.
    
    Args:
        df: DataFrame with app data
        top_n: Number of top apps to display
        save_path: Path to save the figure
    """
    # Select top N apps
    top_apps = df.head(top_n).copy()
    
    # Prepare data
    apps = top_apps["app_name"].tolist()
    mau = top_apps["mau_millions"].tolist()
    categories = top_apps["category"].tolist()
    ranks = top_apps["global_rank"].astype(int).tolist()
    
    # Create color mapping for categories
    colors = [DOMAIN_COLORS.get(cat, "#808080") for cat in categories]
    
    # Create figure with publication-quality settings
    fig, ax = plt.subplots(figsize=(16, 10))
    
    # Create bars
    bars = ax.barh(range(len(apps)), mau, color=colors, alpha=0.8, edgecolor='black', linewidth=0.5)
    
    # Customize axes
    ax.set_xlabel("Monthly Active Users (Millions)", fontsize=14, fontweight='bold')
    ax.set_ylabel("Application", fontsize=14, fontweight='bold')
    ax.set_title(
        f"Top {top_n} Global Applications by Monthly Active Users",
        fontsize=16,
        fontweight='bold',
        pad=20
    )
    
    # Set y-axis labels with rank and app name
    y_labels = [f"#{rank} {app}" for rank, app in zip(ranks, apps)]
    ax.set_yticks(range(len(apps)))
    ax.set_yticklabels(y_labels, fontsize=9)
    
    # Invert y-axis so rank 1 is at top
    ax.invert_yaxis()
    
    # Add value labels on bars
    for i, (bar, value) in enumerate(zip(bars, mau)):
        width = bar.get_width()
        ax.text(
            width + (max(mau) * 0.01),
            bar.get_y() + bar.get_height() / 2,
            f'{value:.0f}M',
            ha='left',
            va='center',
            fontsize=8,
            fontweight='bold'
        )
    
    # Create legend for categories
    category_counts = pd.Series(categories).value_counts()
    legend_elements = []
    for category in category_counts.index:
        color = DOMAIN_COLORS.get(category, "#808080")
        legend_elements.append(mpatches.Patch(color=color, label=category))
    
    # Place legend outside the plot
    ax.legend(
        handles=legend_elements,
        title="Domain / Category",
        bbox_to_anchor=(1.02, 1),
        loc='upper left',
        fontsize=10,
        title_fontsize=11
    )
    
    # Grid for better readability
    ax.grid(axis='x', alpha=0.3, linestyle='--', linewidth=0.5)
    ax.set_axisbelow(True)
    
    # Adjust layout to prevent label cutoff
    plt.tight_layout()
    
    # Save figure
    if save_path is None:
        save_path = OUTPUT_DIR / f"top_{top_n}_apps_comparison.png"
    
    plt.savefig(
        save_path,
        dpi=300,
        bbox_inches='tight',
        facecolor='white',
        edgecolor='none'
    )
    print(f"Graph saved to: {save_path}")
    
    # Also save as PDF for publication
    pdf_path = save_path.with_suffix('.pdf')
    plt.savefig(
        pdf_path,
        bbox_inches='tight',
        facecolor='white',
        edgecolor='none'
    )
    print(f"PDF version saved to: {pdf_path}")
    
    plt.close()
    return save_path

def create_category_comparison(df, save_path=None):
    """
    Create a bar chart comparing average MAU by category.
    """
    # Group by category and calculate stats
    category_stats = df.groupby("category").agg({
        "mau_millions": ["mean", "sum", "count"]
    }).round(2)
    category_stats.columns = ["avg_mau", "total_mau", "app_count"]
    category_stats = category_stats.sort_values("avg_mau", ascending=False)
    
    # Create figure
    fig, ax = plt.subplots(figsize=(12, 8))
    
    categories = category_stats.index.tolist()
    avg_mau = category_stats["avg_mau"].tolist()
    colors = [DOMAIN_COLORS.get(cat, "#808080") for cat in categories]
    
    bars = ax.barh(range(len(categories)), avg_mau, color=colors, alpha=0.8, edgecolor='black', linewidth=0.5)
    
    ax.set_xlabel("Average Monthly Active Users (Millions)", fontsize=14, fontweight='bold')
    ax.set_ylabel("Category", fontsize=14, fontweight='bold')
    ax.set_title(
        "Average Monthly Active Users by Application Category",
        fontsize=16,
        fontweight='bold',
        pad=20
    )
    
    ax.set_yticks(range(len(categories)))
    ax.set_yticklabels(categories, fontsize=11)
    ax.invert_yaxis()
    
    # Add value labels
    for i, (bar, value) in enumerate(zip(bars, avg_mau)):
        width = bar.get_width()
        ax.text(
            width + (max(avg_mau) * 0.01),
            bar.get_y() + bar.get_height() / 2,
            f'{value:.0f}M',
            ha='left',
            va='center',
            fontsize=10,
            fontweight='bold'
        )
    
    ax.grid(axis='x', alpha=0.3, linestyle='--', linewidth=0.5)
    ax.set_axisbelow(True)
    
    plt.tight_layout()
    
    if save_path is None:
        save_path = OUTPUT_DIR / "category_comparison.png"
    
    plt.savefig(save_path, dpi=300, bbox_inches='tight', facecolor='white', edgecolor='none')
    print(f"Category comparison graph saved to: {save_path}")
    
    pdf_path = save_path.with_suffix('.pdf')
    plt.savefig(pdf_path, bbox_inches='tight', facecolor='white', edgecolor='none')
    print(f"PDF version saved to: {pdf_path}")
    
    plt.close()
    return save_path

def main():
    """Main function to generate all graphs."""
    print("Loading dataset...")
    df = load_data()
    
    print(f"\nLoaded {len(df)} apps with global rankings")
    print(f"MAU range: {df['mau_millions'].min():.0f}M - {df['mau_millions'].max():.0f}M")
    
    # Generate top 50 apps comparison
    print("\nGenerating top 50 apps comparison graph...")
    create_comparison_graph(df, top_n=50)
    
    # Generate top 20 apps comparison (more focused)
    print("\nGenerating top 20 apps comparison graph...")
    create_comparison_graph(df, top_n=20, save_path=OUTPUT_DIR / "top_20_apps_comparison.png")
    
    # Generate category comparison
    print("\nGenerating category comparison graph...")
    create_category_comparison(df)
    
    print("\nAll graphs generated successfully!")

if __name__ == "__main__":
    main()


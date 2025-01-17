using Microsoft.EntityFrameworkCore;
using NovaSigorta.Domain.Entities;
using ApplicationEntity = NovaSigorta.Domain.Entities.Application;

namespace NovaSigorta.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Insurance> Insurances { get; set; }
    public DbSet<ApplicationEntity> Applications { get; set; }
    public DbSet<Admin> Admins { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Insurance>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("NOW()");
        });

        modelBuilder.Entity<ApplicationEntity>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Phone).IsRequired().HasMaxLength(15);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("NOW()");

            entity.HasOne(e => e.Insurance)
                  .WithMany(e => e.Applications)
                  .HasForeignKey(e => e.InsuranceId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Admin>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Username).IsRequired().HasMaxLength(50);
            entity.Property(e => e.PasswordHash).IsRequired().HasMaxLength(255);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("NOW()");
            entity.HasIndex(e => e.Username).IsUnique();
        });

        SeedData(modelBuilder);
    }

    private static void SeedData(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Admin>().HasData(
            new Admin
            {
                Id = 1,
                Username = "admin",
                PasswordHash = "$2a$11$rWjRHzUMHEpTr/L5dUw2fOPm8kD7FHPt4DcmJ5xH7W.UqOGHK9c/m",
                CreatedAt = new DateTime(2025, 1, 10, 10, 0, 0, DateTimeKind.Utc)
            }
        );

        modelBuilder.Entity<Insurance>().HasData(
            new Insurance
            {
                Id = 1,
                Name = "Kasko Sigortası",
                Description = "Araç hasar ve çalınma sigortası",
                IsActive = true,
                CreatedAt = new DateTime(2025, 1, 10, 10, 0, 0, DateTimeKind.Utc)
            },
            new Insurance
            {
                Id = 2,
                Name = "Konut Sigortası",
                Description = "Ev yangın ve hırsızlık sigortası",
                IsActive = true,
                CreatedAt = new DateTime(2025, 1, 10, 10, 0, 0, DateTimeKind.Utc)
            },
            new Insurance
            {
                Id = 3,
                Name = "Sağlık Sigortası",
                Description = "Özel sağlık sigortası",
                IsActive = true,
                CreatedAt = new DateTime(2025, 1, 10, 10, 0, 0, DateTimeKind.Utc)
            }
        );
    }
}

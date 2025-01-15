using Microsoft.EntityFrameworkCore;
using NovaSigorta.Application.Interfaces;
using NovaSigorta.Domain.Entities;
using NovaSigorta.Infrastructure.Data;
using ApplicationEntity = NovaSigorta.Domain.Entities.Application;

namespace NovaSigorta.Infrastructure.Repositories;

public class ApplicationRepository : GenericRepository<ApplicationEntity>, IApplicationRepository
{
    public ApplicationRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<ApplicationEntity>> GetApplicationsWithInsuranceAsync()
    {
        return await _dbSet
            .Include(x => x.Insurance)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<ApplicationEntity>> GetApplicationsByInsuranceIdAsync(int insuranceId)
    {
        return await _dbSet
            .Where(x => x.InsuranceId == insuranceId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();
    }
}

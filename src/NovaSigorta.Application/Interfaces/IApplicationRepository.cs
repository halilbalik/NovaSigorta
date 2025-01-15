using NovaSigorta.Domain.Entities;
using ApplicationEntity = NovaSigorta.Domain.Entities.Application;

namespace NovaSigorta.Application.Interfaces;

public interface IApplicationRepository : IGenericRepository<ApplicationEntity>
{
    Task<IEnumerable<ApplicationEntity>> GetApplicationsWithInsuranceAsync();
    Task<IEnumerable<ApplicationEntity>> GetApplicationsByInsuranceIdAsync(int insuranceId);
}

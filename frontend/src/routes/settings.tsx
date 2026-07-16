import { createFileRoute } from "@tanstack/react-router";
import { Settings, Sliders, Users, ShieldAlert, Save } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings · AMAS" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="grid-bg min-h-full">
      <div className="mx-auto flex h-full max-w-[1200px] flex-col gap-6 p-4 lg:p-6">
        
        <header className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Settings className="h-6 w-6 text-primary" /> System Settings
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Configure global autonomy levels and role-based access controls.
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-glow transition-colors shadow-sm">
            <Save className="h-4 w-4" /> Save Changes
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-2">
          
          <div className="md:col-span-1">
            <nav className="flex flex-col gap-1">
              <a href="#autonomy" className="bg-surface border border-border text-foreground px-4 py-2.5 rounded-md text-sm font-medium flex items-center gap-2">
                <Sliders className="h-4 w-4 text-primary" /> Autonomy Levels
              </a>
              <a href="#roles" className="text-muted-foreground hover:text-foreground hover:bg-surface/50 px-4 py-2.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                <Users className="h-4 w-4" /> Role Access
              </a>
              <a href="#alerts" className="text-muted-foreground hover:text-foreground hover:bg-surface/50 px-4 py-2.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                <ShieldAlert className="h-4 w-4" /> Escalation Rules
              </a>
            </nav>
          </div>

          <div className="md:col-span-2 space-y-6">
            
            <section id="autonomy" className="panel p-6">
              <h2 className="text-base font-semibold mb-4">Global Autonomy Limits</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Set the maximum allowed autonomy for agents across all workflows. Workflows can be more restrictive than this global setting, but never more permissive.
              </p>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium">Default Execution Mode</label>
                    <span className="text-xs font-mono text-primary">Act & Notify</span>
                  </div>
                  <input type="range" min="1" max="4" defaultValue="3" className="w-full accent-primary bg-surface h-2 rounded-lg appearance-none cursor-pointer" />
                  <div className="flex justify-between mt-2 text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                    <span>Suggest Only</span>
                    <span>Ask Before Acting</span>
                    <span className="text-primary">Act & Notify</span>
                    <span>Full Autonomy</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <h3 className="text-sm font-medium mb-3">Workflow Overrides</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-surface border border-border rounded-md">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">Finance Reconciliation</span>
                        <span className="text-xs text-muted-foreground">T-2841</span>
                      </div>
                      <select className="bg-background border border-border rounded-md px-3 py-1.5 text-sm outline-none">
                        <option>Suggest Only</option>
                        <option selected>Ask Before Acting</option>
                        <option>Act & Notify</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-surface border border-border rounded-md">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">Customer Support Triage</span>
                        <span className="text-xs text-muted-foreground">T-1192</span>
                      </div>
                      <select className="bg-background border border-border rounded-md px-3 py-1.5 text-sm outline-none">
                        <option>Suggest Only</option>
                        <option>Ask Before Acting</option>
                        <option selected>Act & Notify</option>
                        <option>Full Autonomy</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="roles" className="panel p-6">
              <h2 className="text-base font-semibold mb-4">Role-Based Access Control</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Define which user roles can approve high-risk actions in the Human-in-the-Loop queue.
              </p>

              <table className="w-full text-sm text-left">
                <thead className="border-b border-border text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="pb-3 font-medium">Role</th>
                    <th className="pb-3 font-medium">Max Approval Tier</th>
                    <th className="pb-3 font-medium">System Config</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="py-3 font-medium text-foreground">Ops Supervisor</td>
                    <td className="py-3 text-critical font-medium">High Risk</td>
                    <td className="py-3">Read Only</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium text-foreground">Workflow Analyst</td>
                    <td className="py-3 text-warning font-medium">Medium Risk</td>
                    <td className="py-3">Edit Workflows</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium text-foreground">Agent Engineer</td>
                    <td className="py-3 text-critical font-medium">High Risk</td>
                    <td className="py-3">Full Admin</td>
                  </tr>
                </tbody>
              </table>
              <button className="mt-4 text-xs font-medium text-primary hover:underline">
                + Add Custom Role
              </button>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}

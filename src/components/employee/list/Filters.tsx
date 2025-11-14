import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FiltersProps {
    t: (key: string) => string;
    values: { search: string; status: string; position: string; location: string };
    onChange: (next: Partial<FiltersProps["values"]>) => void;
}

export function Filters({ t, values, onChange }: FiltersProps) {
    return (
        <>
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                    type="text"
                    placeholder={t("search_placeholder")}
                    className="pl-10"
                    value={values.search}
                    onChange={(e) => onChange({ search: e.target.value })}
                />
            </div>

            <Select
                value={values.status || "all"}
                onValueChange={(value) => onChange({ status: value === "all" ? "" : value })}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t("status")} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">{t("all_statuses")}</SelectItem>
                    <SelectItem value="pending">{t("status_filter.pending")}</SelectItem>
                    <SelectItem value="approved">{t("status_filter.approved")}</SelectItem>
                    <SelectItem value="rejected">{t("status_filter.rejected")}</SelectItem>
                    <SelectItem value="interviewing">{t("status_filter.interviewing")}</SelectItem>
                </SelectContent>
            </Select>

            <Select
                value={values.position || "all"}
                onValueChange={(value) => onChange({ position: value === "all" ? "" : value })}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t("position")} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">{t("all_positions")}</SelectItem>
                    <SelectItem value="Frontend Developer">{t("position_filter.frontend_developer")}</SelectItem>
                    <SelectItem value="Backend Developer">{t("position_filter.backend_developer")}</SelectItem>
                    <SelectItem value="Full Stack Developer">{t("position_filter.full_stack_developer")}</SelectItem>
                    <SelectItem value="DevOps Engineer">{t("position_filter.devops_engineer")}</SelectItem>
                    <SelectItem value="UI/UX Designer">{t("position_filter.ui_ux_designer")}</SelectItem>
                    <SelectItem value="Product Manager">{t("position_filter.product_manager")}</SelectItem>
                </SelectContent>
            </Select>

            <Select
                value={values.location || "all"}
                onValueChange={(value) => onChange({ location: value === "all" ? "" : value })}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t("location")} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">{t("all_locations")}</SelectItem>
                    <SelectItem value="Hà Nội">{t("location_filter.ha_noi")}</SelectItem>
                    <SelectItem value="TP.HCM">{t("location_filter.tp_hcm")}</SelectItem>
                    <SelectItem value="Đà Nẵng">{t("location_filter.da_nang")}</SelectItem>
                </SelectContent>
            </Select>
        </>
    );
}

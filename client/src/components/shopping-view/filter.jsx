import { filterOptions } from "@/config";
import { Fragment } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";

function ProductFilter({ filters, handleFilter }) {
  return (
    <div className="bg-white">
      <div className="py-6 border-b border-gray-100 mb-8">
        <h2 className="text-xl font-serif font-normal text-[#1a1c24] tracking-tight">Refine Selection</h2>
      </div>
      <div className="space-y-10">
        {Object.keys(filterOptions).map((keyItem) => (
          <Fragment key={keyItem}>
            <div>
              <h3 className="text-[10px] font-semibold text-primary uppercase tracking-[0.2em] mb-6">
                {keyItem}
              </h3>
              <div className="grid gap-4 mt-2">
                {filterOptions[keyItem].map((option) => (
                  <Label key={option.id} className="flex font-light items-center gap-3 cursor-pointer group hover:text-primary transition-colors">
                    <Checkbox
                      checked={
                        filters &&
                        Object.keys(filters).length > 0 &&
                        filters[keyItem] &&
                        filters[keyItem].indexOf(option.id) > -1
                      }
                      onCheckedChange={() => handleFilter(keyItem, option.id)}
                      className="rounded-none border-gray-200 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <span className="text-sm text-gray-600 group-hover:text-primary">{option.label}</span>
                  </Label>
                ))}
              </div>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default ProductFilter;

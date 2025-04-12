import { criterionCategory, Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
    log: ["query"],
});


async function categoryCriterionSeed() {
    try {

        const criterionCategory = [
            { name: 'academic wise' },
            { name: 'social class' },
            { name: 'minority group'},
            { name: 'activity engagement'},
            { name: 'additional criteria' },
        ];
        
        await prisma.criterionCategory.createMany({
            data: criterionCategory,
            skipDuplicates: true,
        });
        console.log('Category Criterion seeded successfully!');
    } catch (e) {
        console.error('Error seeding Category Criterion:', e);
    } finally {
        await prisma.$disconnect();
    }
}

async function criterionSeed() {
    try {

        // Get all criterion categories
        const categories: criterionCategory[] = await prisma.criterionCategory.findMany();

        const criterion: Prisma.defaultCategoryCriterionUncheckedCreateInput[] = categories.flatMap((category: criterionCategory) => {
            const data:Prisma.defaultCategoryCriterionUncheckedCreateInput[] = [];
            if (category.name === "academic wise") {
                data.push(
                    {
                        name: "gwa",
                        criterion_category_id: category.id,
                    },
                    {
                        name: "academic honors received",
                        criterion_category_id: category.id,
                    },
                    {
                        name: "educational level",
                        criterion_category_id: category.id,
                    },
                );
            }

            if (category.name === "social class") {
                data.push(
                    {
                        name: "residency",
                        criterion_category_id: category.id,
                    },
                    {
                        name: "monthly income",
                        criterion_category_id: category.id,
                    },
                    {
                        name: "number of siblings",
                        criterion_category_id: category.id,
                    },
                    {
                        name: "parent status",
                        criterion_category_id: category.id,
                    },
                );
            }

            if (category.name === "minority group") {
                data.push(
                    {
                        name: "indigent",
                        criterion_category_id: category.id,
                    },
                    {
                        name: "people with disability",
                        criterion_category_id: category.id,
                    },
                );
            }

            if (category.name === "activity engagement") {
                data.push(
                    {
                        name: "leadership/community involvement",
                        criterion_category_id: category.id,
                    }
                );
            }

            if (category.name === "additional criteria") {
                data.push(
                    {
                        name: "financial assistance interview",
                        criterion_category_id: category.id,
                    },
                    {
                        name: "financial assistance exam",
                        criterion_category_id: category.id,
                    },
                    {
                        name: "school liability",
                        criterion_category_id: category.id,
                    },
                    {
                        name: "recommendation/endorsement",
                        criterion_category_id: category.id,
                    }
                );
            }

            return data;
        });

        
        await prisma.defaultCategoryCriterion.createMany({
            data: criterion,
            skipDuplicates: true,
        });
        console.log('Criterion seeded successfully!');
    } catch (e) {
        console.error('Error seeding Criterion:', e);
    } finally {
        await prisma.$disconnect();
    }
}

async function seedAllCriterion() {
    try {
        await categoryCriterionSeed();
        console.log("Category Criterion seeding done");
    
        await criterionSeed();
        console.log("Criterion seeding done");

        console.log("All seeding completed!");
    } catch (error) {
        console.error("Error during seeding:", error);
    }
}

seedAllCriterion();


class CitationGenerator:
    @staticmethod
    def generate_mla_citation(reference):
        citation = ""

        # Add author information
        if reference.author_last:
            if reference.author_first:
                citation += f"{reference.author_last}, {reference.author_first}."
            else:
                citation += f"{reference.author_last}."
        elif reference.organization_name:
            citation += f"{reference.organization_name}."

        # Add title
        citation += f' "{reference.title}."'

        # Add container name
        if reference.container_name:
            citation += f" {reference.container_name},"

        # Add publication date
        if (
            reference.publication_day
            and reference.publication_month
            and reference.publication_year
        ):
            citation += f" {reference.publication_day} {reference.publication_month} {reference.publication_year},"

        # Add URL
        if reference.url:
            citation += f" {reference.url}."

        return citation

    @staticmethod
    def generate_apa_citation(reference):
        citation = ""

        # Add author information
        if reference.author_last:
            if reference.author_first:
                citation += f"{reference.author_last}, {reference.author_first[0]}."  # Include only the first initial
            else:
                citation += f"{reference.author_last}."

        # Add publication date
        if reference.publication_year:
            citation += f" ({reference.publication_year})."

        # Add title
        if reference.title:
            citation += f" {reference.title}."

        # Add container name
        if reference.container_name:
            citation += f" {reference.container_name}."

        # Add URL
        if reference.url:
            citation += f" {reference.url}."

        return citation

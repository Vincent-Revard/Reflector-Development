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
        elif reference.publication_month and reference.publication_year:
            citation += f" {reference.publication_month} {reference.publication_year},"
        elif reference.publication_year:
            citation += f" {reference.publication_year},"

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

    @staticmethod
    def format_mla_citation(citation):
        # Add quotation marks around the title
        citation = citation.replace('"', '\\"')
        citation = f'"{citation}"'

        # Add a period at the end if it's missing
        if not citation.endswith("."):
            citation += "."

        # Apply hanging indent if needed
        lines = citation.split("\n")
        formatted_citation = lines[0] + "\n"
        for line in lines[1:]:
            formatted_citation += " " * 5 + line.strip() + "\n"  # 0.5 inch = 0.5 * 10 = 5 spaces

        return formatted_citation

    @staticmethod
    def format_apa_citation(citation):
        # Add a period at the end if it's missing
        if not citation.endswith("."):
            citation += "."

        # Apply hanging indent for all lines except the first
        lines = citation.split("\n")
        formatted_citation = lines[0] + "\n"
        for line in lines[1:]:
            formatted_citation += " " * 5 + line.strip() + "\n"  # 0.5 inch = 0.5 * 14 = 7 spaces

        return formatted_citation

    #I'm trying to add in-text citations in a single line but with multiple different sources. How would I list theauthors? all you do is use their AuthorLast; seperated by a semi-colon and a space before the next AuthorLast.... ONLY IF PLAN TO DO IN-TEXT CITATIONS

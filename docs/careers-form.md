# Careers Form

Job applications use Netlify Forms.

Form name:

```text
job-application
```

The job page automatically sends these hidden fields with each submission:

```text
form-name
job_title
job_url
subject
```

Applicants do not need to type the job title manually. The template gets it from the job page title.

To forward applications by email, configure a Netlify Forms notification for the `job-application` form in the Netlify dashboard. Resume uploads are submitted through the `resume` file field.
